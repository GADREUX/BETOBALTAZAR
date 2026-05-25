-- ═══════════════════════════════════════════════════════════════
-- BETO BALTAZAR CORRETOR — Schema Completo
-- Execute este SQL no Supabase: SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════

-- Habilita UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. PROPRIETÁRIOS ────────────────────────────────────────────
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  bank_info TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. INQUILINOS ───────────────────────────────────────────────
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. IMÓVEIS (limite 50 garantido por trigger) ───────────────
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- Casa, Apartamento, Terreno, Comercial, Rural, Cobertura, Kitnet, Sobrado
  purpose TEXT NOT NULL, -- Venda, Locação, Venda e Locação
  status TEXT DEFAULT 'Disponível', -- Disponível, Reservado, Vendido, Alugado
  price NUMERIC DEFAULT 0,
  rent NUMERIC DEFAULT 0,
  area NUMERIC DEFAULT 0,
  lot_area NUMERIC DEFAULT 0,
  bedrooms INT DEFAULT 0,
  suites INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  parking INT DEFAULT 0,
  address TEXT,
  neighborhood TEXT,
  city TEXT DEFAULT 'Capão Bonito',
  state TEXT DEFAULT 'SP',
  cep TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}', -- ["Piscina", "Suíte", ...]
  photos TEXT[] DEFAULT '{}', -- URLs das fotos no Supabase Storage
  portals TEXT[] DEFAULT '{}', -- ["ZAP", "OLX", "Viva Real"]
  iptu NUMERIC DEFAULT 0,
  condo_fee NUMERIC DEFAULT 0,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_purpose ON properties(purpose);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_published ON properties(is_published);

-- Trigger: limite de 50 imóveis ativos
CREATE OR REPLACE FUNCTION check_property_limit() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM properties) >= 50 THEN
    RAISE EXCEPTION 'Limite de 50 imóveis cadastrados atingido';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_property_limit
  BEFORE INSERT ON properties
  FOR EACH ROW EXECUTE FUNCTION check_property_limit();

-- ─── 4. CONTRATOS DE LOCAÇÃO ─────────────────────────────────────
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  contract_type TEXT DEFAULT 'Locação Residencial',
  rent_value NUMERIC NOT NULL,
  deposit NUMERIC DEFAULT 0,
  readjustment_index TEXT DEFAULT 'IGPM',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_day INT DEFAULT 10,
  status TEXT DEFAULT 'Ativo', -- Ativo, Encerrado, Pendente
  clauses TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. BOLETOS (PIX) ────────────────────────────────────────────
CREATE TABLE boletos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  value NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'Pendente', -- Pendente, Pago, Vencido, Cancelado
  pix_code TEXT,
  pix_qr_code TEXT,
  notes TEXT,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_boletos_status ON boletos(status);
CREATE INDEX idx_boletos_due ON boletos(due_date);

-- ─── 6. LEADS / CRM ──────────────────────────────────────────────
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  interest TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  stage TEXT DEFAULT 'Novo Lead', -- Novo Lead, Contato Feito, Visita Agendada, Proposta, Negociação, Fechado, Perdido
  source TEXT DEFAULT 'Site', -- Site, WhatsApp, Indicação, Portal, Instagram, Facebook, Telefone, Outro
  deal_value NUMERIC DEFAULT 0,
  notes TEXT,
  last_contact_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_stage ON leads(stage);

-- ─── 7. SUBMISSÕES DO SITE PÚBLICO ───────────────────────────────
-- Quando cliente preenche o formulário de cadastro de imóvel/interesse
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- 'cadastro_imovel', 'interesse_compra', 'contato'
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  property_type TEXT,
  purpose TEXT, -- Venda, Locação
  property_address TEXT,
  property_details TEXT,
  message TEXT,
  attachments TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Novo', -- Novo, Visto, Convertido
  converted_to_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON submissions(status);

-- ─── 8. VISTORIAS / LAUDOS ───────────────────────────────────────
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  inspection_type TEXT DEFAULT 'Entrada', -- Entrada, Saída
  inspection_date DATE NOT NULL,
  inspector_name TEXT DEFAULT 'Beto Baltazar',
  status TEXT DEFAULT 'Em Andamento', -- Em Andamento, Concluído
  general_notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. ITENS DE VISTORIA ────────────────────────────────────────
CREATE TABLE inspection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  room TEXT NOT NULL,
  item TEXT NOT NULL,
  condition TEXT NOT NULL, -- Ótimo, Bom, Regular, Ruim, Péssimo
  notes TEXT,
  photos TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0
);

-- ─── 10. PORTAIS (status de sincronização por imóvel) ───────────
CREATE TABLE portal_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  portal_name TEXT NOT NULL, -- ZAP Imóveis, OLX, Viva Real, etc
  external_id TEXT,
  external_url TEXT,
  status TEXT DEFAULT 'Ativo', -- Ativo, Pausado, Removido
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 11. ATIVIDADES (log de tudo que acontece) ──────────────────
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT, -- property, contract, lead, boleto, inspection
  entity_id UUID,
  action TEXT, -- created, updated, deleted, status_changed, whatsapp_sent
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS: updated_at automático
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION trg_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER owners_updated BEFORE UPDATE ON owners FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER properties_updated BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER contracts_updated BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER boletos_updated BEFORE UPDATE ON boletos FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION trg_updated_at();
CREATE TRIGGER inspections_updated BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION trg_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE boletos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Imóveis publicados são visíveis ao público (site)
CREATE POLICY "Imóveis publicados são visíveis ao público"
  ON properties FOR SELECT TO anon
  USING (is_published = TRUE);

-- Qualquer pessoa pode criar uma submissão (formulário público)
CREATE POLICY "Público pode criar submissões"
  ON submissions FOR INSERT TO anon
  WITH CHECK (TRUE);

-- Tudo o resto exige usuário autenticado (apenas o gestor)
CREATE POLICY "Auth tem acesso total a owners" ON owners FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a tenants" ON tenants FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a properties" ON properties FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a contracts" ON contracts FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a boletos" ON boletos FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a leads" ON leads FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a submissions" ON submissions FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a inspections" ON inspections FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a inspection_items" ON inspection_items FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a portal_listings" ON portal_listings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Auth tem acesso total a activities" ON activities FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS (para fotos de imóveis)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('property-photos', 'property-photos', TRUE),
  ('contract-pdfs', 'contract-pdfs', FALSE),
  ('inspection-photos', 'inspection-photos', TRUE),
  ('submission-files', 'submission-files', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Policies do Storage
CREATE POLICY "Fotos de imóveis são públicas"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'property-photos');

CREATE POLICY "Fotos de vistoria são públicas"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'inspection-photos');

CREATE POLICY "Anon pode upload em submission-files"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'submission-files');

CREATE POLICY "Auth tem total acesso ao storage"
  ON storage.objects FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA (dados iniciais de exemplo)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO owners (name, cpf, phone, email, address) VALUES
  ('Carlos Alberto Silva', '123.456.789-00', '(15) 99999-1111', 'carlos@email.com', 'Rua A, 100 - Centro, Capão Bonito/SP'),
  ('Maria Helena Santos', '987.654.321-00', '(15) 99999-2222', 'maria@email.com', 'Rua B, 200 - Vila Nova, Capão Bonito/SP');

INSERT INTO properties (code, title, type, purpose, price, area, bedrooms, suites, bathrooms, parking, address, neighborhood, city, state, description, features, status, is_featured) VALUES
  ('001', 'Casa Térrea de Alto Padrão no Centro', 'Casa', 'Venda', 990000, 174, 3, 2, 3, 2, 'Rua Bernardino de Campos, 736', 'Centro', 'Capão Bonito', 'SP', 'Linda casa térrea no centro da cidade. 3 dormitórios sendo 2 suítes, ampla sala de estar e jantar integradas, cozinha americana planejada, área gourmet com churrasqueira, piscina. Acabamento de primeira linha.', ARRAY['Suíte','Cozinha Planejada','Piscina','Churrasqueira','Quintal'], 'Disponível', TRUE),
  ('002', 'Casa com Edícula na Av. Amazonas', 'Casa', 'Venda', 270000, 114, 3, 0, 2, 1, 'Av. Amazonas, 500', 'Vila Bela Vista', 'Capão Bonito', 'SP', 'Casa com edícula, 3 dormitórios, sala ampla, cozinha, banheiro social, área de serviço.', ARRAY['Edícula','Quintal Grande'], 'Disponível', TRUE),
  ('003', 'Ampla Casa 5 Quartos Bela Vista', 'Sobrado', 'Venda', 220000, 125, 5, 1, 2, 1, 'Rua das Flores, 200', 'Bela Vista', 'Capão Bonito', 'SP', 'Ampla residência com 5 dormitórios sendo 1 suíte. Ideal para família grande.', ARRAY['5 Quartos','Suíte','Garagem'], 'Disponível', FALSE),
  ('004', 'Ponto Comercial com Casa Nova', 'Comercial', 'Venda', 420000, 300, 2, 0, 2, 4, 'Av. Principal, 1200', 'Vila Bela Vista', 'Capão Bonito', 'SP', 'Excelente ponto comercial com casa nova nos fundos. Terreno 300m².', ARRAY['Ponto Comercial','Alto Fluxo'], 'Disponível', TRUE);
