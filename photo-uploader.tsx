// Tipos do banco de dados — gerados manualmente, espelham o schema.sql

export type PropertyType = 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Rural' | 'Cobertura' | 'Kitnet' | 'Sobrado';
export type PropertyPurpose = 'Venda' | 'Locação' | 'Venda e Locação';
export type PropertyStatus = 'Disponível' | 'Reservado' | 'Vendido' | 'Alugado';
export type LeadStage = 'Novo Lead' | 'Contato Feito' | 'Visita Agendada' | 'Proposta' | 'Negociação' | 'Fechado' | 'Perdido';
export type LeadSource = 'Site' | 'WhatsApp' | 'Indicação' | 'Portal' | 'Instagram' | 'Facebook' | 'Telefone' | 'Outro';
export type BoletoStatus = 'Pendente' | 'Pago' | 'Vencido' | 'Cancelado';
export type ContractStatus = 'Ativo' | 'Encerrado' | 'Pendente';
export type InspectionType = 'Entrada' | 'Saída';
export type ItemCondition = 'Ótimo' | 'Bom' | 'Regular' | 'Ruim' | 'Péssimo';
export type SubmissionType = 'cadastro_imovel' | 'interesse_compra' | 'contato';

export interface Property {
  id: string;
  code: string | null;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  price: number;
  rent: number;
  area: number;
  lot_area: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  address: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  cep: string | null;
  description: string | null;
  features: string[];
  photos: string[];
  portals: string[];
  iptu: number;
  condo_fee: number;
  owner_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Owner {
  id: string;
  name: string;
  cpf: string | null;
  rg: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  bank_info: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  cpf: string | null;
  rg: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  emergency_contact: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  property_id: string;
  owner_id: string | null;
  tenant_id: string | null;
  contract_type: string;
  rent_value: number;
  deposit: number;
  readjustment_index: string;
  start_date: string;
  end_date: string;
  payment_day: number;
  status: ContractStatus;
  clauses: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Boleto {
  id: string;
  contract_id: string;
  tenant_id: string | null;
  property_id: string | null;
  value: number;
  due_date: string;
  paid_date: string | null;
  status: BoletoStatus;
  pix_code: string | null;
  pix_qr_code: string | null;
  notes: string | null;
  reminder_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  interest: string | null;
  property_id: string | null;
  stage: LeadStage;
  source: LeadSource;
  deal_value: number;
  notes: string | null;
  last_contact_at: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  type: SubmissionType;
  name: string;
  phone: string;
  email: string | null;
  property_type: string | null;
  purpose: string | null;
  property_address: string | null;
  property_details: string | null;
  message: string | null;
  attachments: string[];
  status: 'Novo' | 'Visto' | 'Convertido';
  converted_to_lead_id: string | null;
  created_at: string;
}

export interface Inspection {
  id: string;
  property_id: string;
  tenant_id: string | null;
  inspection_type: InspectionType;
  inspection_date: string;
  inspector_name: string;
  status: 'Em Andamento' | 'Concluído';
  general_notes: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface InspectionItem {
  id: string;
  inspection_id: string;
  room: string;
  item: string;
  condition: ItemCondition;
  notes: string | null;
  photos: string[];
  display_order: number;
}
