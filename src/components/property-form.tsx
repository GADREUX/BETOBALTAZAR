'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import PhotoUploader from '@/components/photo-uploader';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Property, Owner } from '@/types/database';

const PROPERTY_TYPES = ['Casa', 'Apartamento', 'Terreno', 'Comercial', 'Rural', 'Cobertura', 'Kitnet', 'Sobrado'];
const PURPOSES = ['Venda', 'Locação', 'Venda e Locação'];
const STATUSES = ['Disponível', 'Reservado', 'Vendido', 'Alugado'];
const COMMON_FEATURES = [
  'Piscina', 'Churrasqueira', 'Suíte', 'Quintal', 'Garagem coberta',
  'Cozinha planejada', 'Armários planejados', 'Área de serviço',
  'Edícula', 'Portão eletrônico', 'Mobiliado', 'Aceita pets',
  'Próximo ao centro', 'Próximo a escola', 'Vista privilegiada',
];

interface PropertyFormProps {
  initial?: Property;
  owners: Owner[];
}

export default function PropertyForm({ initial, owners }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    code: initial?.code || '',
    title: initial?.title || '',
    type: initial?.type || 'Casa',
    purpose: initial?.purpose || 'Venda',
    status: initial?.status || 'Disponível',
    price: initial?.price || 0,
    rent: initial?.rent || 0,
    area: initial?.area || 0,
    lot_area: initial?.lot_area || 0,
    bedrooms: initial?.bedrooms || 0,
    suites: initial?.suites || 0,
    bathrooms: initial?.bathrooms || 0,
    parking: initial?.parking || 0,
    address: initial?.address || '',
    neighborhood: initial?.neighborhood || '',
    city: initial?.city || 'Capão Bonito',
    state: initial?.state || 'SP',
    cep: initial?.cep || '',
    description: initial?.description || '',
    features: initial?.features || [],
    photos: initial?.photos || [],
    iptu: initial?.iptu || 0,
    condo_fee: initial?.condo_fee || 0,
    owner_id: initial?.owner_id || '',
    is_featured: initial?.is_featured || false,
    is_published: initial?.is_published ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const update = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  function toggleFeature(f: string) {
    setForm((p) => ({
      ...p,
      features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const payload = {
      ...form,
      owner_id: form.owner_id || null,
      code: form.code || null,
    };

    if (isEdit) {
      const { error } = await supabase.from('properties').update(payload).eq('id', initial!.id);
      if (error) {
        toast.error('Erro ao salvar: ' + error.message);
        setLoading(false);
        return;
      }
      toast.success('Imóvel atualizado!');
    } else {
      const { error } = await supabase.from('properties').insert(payload);
      if (error) {
        if (error.message.includes('Limite de 50')) {
          toast.error('Limite de 50 imóveis cadastrados atingido!');
        } else {
          toast.error('Erro ao salvar: ' + error.message);
        }
        setLoading(false);
        return;
      }
      toast.success('Imóvel cadastrado!');
    }

    router.push('/admin/imoveis');
    router.refresh();
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm(`Excluir "${initial.title}"?\nEsta ação não pode ser desfeita.`)) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from('properties').delete().eq('id', initial.id);

    if (error) {
      toast.error('Erro ao excluir');
      setDeleting(false);
      return;
    }

    toast.success('Imóvel excluído');
    router.push('/admin/imoveis');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/imoveis" className="text-sm text-ink-soft hover:text-terra transition flex items-center gap-1.5">
          <ArrowLeft size={14} /> Voltar para imóveis
        </Link>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button type="button" onClick={onDelete} disabled={deleting} className="btn-outline text-red hover:bg-red/5">
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Excluir
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isEdit ? 'Salvar alterações' : 'Cadastrar imóvel'}
          </button>
        </div>
      </div>

      {/* Identificação */}
      <Section title="Identificação" desc="Como o imóvel aparece no site e no painel">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-2">
            <Field label="Código">
              <input className="field-input" value={form.code} onChange={(e) => update('code', e.target.value)} placeholder="001" />
            </Field>
          </div>
          <div className="sm:col-span-10">
            <Field label="Título *" required>
              <input className="field-input" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Casa Térrea de Alto Padrão no Centro" required />
            </Field>
          </div>
          <div className="sm:col-span-4">
            <Field label="Tipo *">
              <select className="field-input" value={form.type} onChange={(e) => update('type', e.target.value as any)}>
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <div className="sm:col-span-4">
            <Field label="Finalidade *">
              <select className="field-input" value={form.purpose} onChange={(e) => update('purpose', e.target.value as any)}>
                {PURPOSES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <div className="sm:col-span-4">
            <Field label="Status *">
              <select className="field-input" value={form.status} onChange={(e) => update('status', e.target.value as any)}>
                {STATUSES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </Section>

      {/* Valores */}
      <Section title="Valores" desc="Preço de venda, aluguel e custos">
        <div className="grid sm:grid-cols-2 gap-4">
          {(form.purpose === 'Venda' || form.purpose === 'Venda e Locação') && (
            <Field label="Preço de venda (R$)">
              <input type="number" min="0" step="0.01" className="field-input" value={form.price} onChange={(e) => update('price', Number(e.target.value))} placeholder="0" />
            </Field>
          )}
          {(form.purpose === 'Locação' || form.purpose === 'Venda e Locação') && (
            <Field label="Valor do aluguel (R$/mês)">
              <input type="number" min="0" step="0.01" className="field-input" value={form.rent} onChange={(e) => update('rent', Number(e.target.value))} placeholder="0" />
            </Field>
          )}
          <Field label="IPTU anual (R$)">
            <input type="number" min="0" step="0.01" className="field-input" value={form.iptu} onChange={(e) => update('iptu', Number(e.target.value))} placeholder="0" />
          </Field>
          <Field label="Condomínio (R$/mês)">
            <input type="number" min="0" step="0.01" className="field-input" value={form.condo_fee} onChange={(e) => update('condo_fee', Number(e.target.value))} placeholder="0" />
          </Field>
        </div>
      </Section>

      {/* Características */}
      <Section title="Características" desc="Quartos, banheiros, vagas e área">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          <Field label="Quartos">
            <input type="number" min="0" className="field-input" value={form.bedrooms} onChange={(e) => update('bedrooms', Number(e.target.value))} />
          </Field>
          <Field label="Suítes">
            <input type="number" min="0" className="field-input" value={form.suites} onChange={(e) => update('suites', Number(e.target.value))} />
          </Field>
          <Field label="Banheiros">
            <input type="number" min="0" className="field-input" value={form.bathrooms} onChange={(e) => update('bathrooms', Number(e.target.value))} />
          </Field>
          <Field label="Vagas">
            <input type="number" min="0" className="field-input" value={form.parking} onChange={(e) => update('parking', Number(e.target.value))} />
          </Field>
          <Field label="Área útil (m²)">
            <input type="number" min="0" step="0.01" className="field-input" value={form.area} onChange={(e) => update('area', Number(e.target.value))} />
          </Field>
          <Field label="Terreno (m²)">
            <input type="number" min="0" step="0.01" className="field-input" value={form.lot_area} onChange={(e) => update('lot_area', Number(e.target.value))} />
          </Field>
        </div>
      </Section>

      {/* Localização */}
      <Section title="Localização" desc="Endereço do imóvel">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-3">
            <Field label="CEP">
              <input className="field-input" value={form.cep} onChange={(e) => update('cep', e.target.value)} placeholder="18300-000" />
            </Field>
          </div>
          <div className="sm:col-span-9">
            <Field label="Endereço (rua, número)">
              <input className="field-input" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Rua Bernardino de Campos, 736" />
            </Field>
          </div>
          <div className="sm:col-span-5">
            <Field label="Bairro">
              <input className="field-input" value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} placeholder="Centro" />
            </Field>
          </div>
          <div className="sm:col-span-5">
            <Field label="Cidade">
              <input className="field-input" value={form.city} onChange={(e) => update('city', e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="UF">
              <input className="field-input" value={form.state} onChange={(e) => update('state', e.target.value)} maxLength={2} />
            </Field>
          </div>
        </div>
      </Section>

      {/* Descrição + Features */}
      <Section title="Descrição e diferenciais" desc="Atrai compradores e melhora o ranqueamento">
        <Field label="Descrição completa">
          <textarea
            className="field-textarea"
            rows={5}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Descreva o imóvel: estilo, acabamentos, vizinhança, comodidades..."
          />
        </Field>

        <Field label="Características (clique para selecionar)">
          <div className="flex flex-wrap gap-2 mt-1">
            {COMMON_FEATURES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  form.features.includes(f)
                    ? 'bg-terra text-white border-terra'
                    : 'bg-white text-ink-soft border-border hover:border-terra/40'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Proprietário */}
      <Section title="Proprietário" desc="Vincule o dono do imóvel (opcional)">
        <Field label="Proprietário">
          <select className="field-input" value={form.owner_id || ''} onChange={(e) => update('owner_id', e.target.value as any)}>
            <option value="">— Sem vínculo —</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </Field>
      </Section>

      {/* Fotos */}
      <Section title="Fotos" desc="A primeira foto será a capa. Arraste para reordenar.">
        <PhotoUploader photos={form.photos} onChange={(photos) => update('photos', photos)} />
      </Section>

      {/* Publicação */}
      <Section title="Publicação" desc="Visibilidade no site público">
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 bg-cream/40 border border-border rounded-xl cursor-pointer hover:border-terra/40 transition">
            <input type="checkbox" checked={form.is_published} onChange={(e) => update('is_published', e.target.checked)} className="mt-0.5 w-4 h-4 accent-terra" />
            <div>
              <div className="font-medium text-ink">Publicar no site público</div>
              <p className="text-xs text-ink-soft/70 mt-0.5">Quando desmarcado, o imóvel não aparece para visitantes do site.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 bg-cream/40 border border-border rounded-xl cursor-pointer hover:border-terra/40 transition">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} className="mt-0.5 w-4 h-4 accent-terra" />
            <div>
              <div className="font-medium text-ink">Destacar na página inicial</div>
              <p className="text-xs text-ink-soft/70 mt-0.5">Aparece na seção de destaques da home.</p>
            </div>
          </label>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Link href="/admin/imoveis" className="btn-outline">Cancelar</Link>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isEdit ? 'Salvar alterações' : 'Cadastrar imóvel'}
        </button>
      </div>
    </form>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="card-base p-6 space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        {desc && <p className="text-xs text-ink-soft/65 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="field-label">{label} {required && <span className="text-terra">*</span>}</label>
      {children}
    </div>
  );
}
