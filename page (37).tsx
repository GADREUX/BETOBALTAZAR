'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { templates, whatsappUrl } from '@/lib/whatsapp';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { CheckCircle, Loader2, Send, AlertCircle } from 'lucide-react';

const PROPERTY_TYPES = ['Casa', 'Apartamento', 'Terreno', 'Comercial', 'Rural', 'Cobertura', 'Kitnet', 'Sobrado'];
const PURPOSES = ['Venda', 'Locação', 'Ambos'];

export default function AnuncieForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submission, setSubmission] = useState<{ name: string; phone: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: 'Casa',
    purpose: 'Venda',
    property_address: '',
    bedrooms: '',
    area: '',
    expected_value: '',
    property_details: '',
    message: '',
    consent: false,
  });

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.property_address) {
      toast.error('Por favor preencha os campos obrigatórios.');
      return;
    }
    if (!form.consent) {
      toast.error('É necessário concordar com o tratamento dos dados.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const details = `Tipo: ${form.property_type}
Finalidade: ${form.purpose}
${form.bedrooms ? `Quartos: ${form.bedrooms}` : ''}
${form.area ? `Área: ${form.area}m²` : ''}
${form.expected_value ? `Valor esperado: ${form.expected_value}` : ''}
${form.property_details ? `\nDetalhes adicionais:\n${form.property_details}` : ''}
${form.message ? `\nMensagem:\n${form.message}` : ''}`.trim();

    const { error } = await supabase.from('submissions').insert({
      type: 'cadastro_imovel',
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      property_type: form.property_type,
      purpose: form.purpose,
      property_address: form.property_address,
      property_details: details,
      message: form.message || null,
    });

    if (error) {
      console.error(error);
      toast.error('Não foi possível enviar. Tente novamente ou nos chame no WhatsApp.');
      setLoading(false);
      return;
    }

    // Notify via EmailJS (best-effort — não bloqueia o sucesso)
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: form.name,
            phone: form.phone,
            email: form.email,
            property_type: form.property_type,
            purpose: form.purpose,
            address: form.property_address,
            details,
            type: 'Cadastro de Imóvel',
          },
          { publicKey }
        );
      }
    } catch (err) {
      console.warn('EmailJS falhou (não-crítico):', err);
    }

    setSubmission({ name: form.name, phone: form.phone });
    setDone(true);
    setLoading(false);
    toast.success('Cadastro enviado com sucesso!');
  }

  if (done && submission) {
    return (
      <div className="card-base p-10 md:p-14 text-center">
        <div className="w-20 h-20 rounded-full bg-green/10 border border-green/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green" size={40} strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
          Cadastro recebido!
        </h2>
        <p className="text-ink-soft/80 text-lg leading-relaxed max-w-md mx-auto mb-8">
          Obrigado, <strong className="text-ink">{submission.name.split(' ')[0]}</strong>. Recebi os dados do seu imóvel.
          Entrarei em contato com você muito em breve pelo telefone {submission.phone}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl(
              '5515996897738',
              `Olá Beto! Acabei de cadastrar meu imóvel no site. Meu nome é ${submission.name}.`
            )}
            target="_blank"
            className="btn-primary"
          >
            Adiantar contato via WhatsApp
          </a>
          <button onClick={() => { setDone(false); setForm({ name: '', phone: '', email: '', property_type: 'Casa', purpose: 'Venda', property_address: '', bedrooms: '', area: '', expected_value: '', property_details: '', message: '', consent: false }); }} className="btn-outline">
            Cadastrar outro imóvel
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-base p-7 md:p-10 space-y-6">
      <div>
        <p className="text-xs tracking-[3px] text-terra uppercase mb-2 font-semibold">
          Etapa 1 — Seus dados
        </p>
        <h2 className="font-display text-2xl font-bold text-ink">Como podemos te chamar?</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nome completo *" required>
          <input className="field-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Seu nome" required />
        </Field>
        <Field label="WhatsApp / Telefone *" required>
          <input
            className="field-input"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="(15) 99999-9999"
            required
            inputMode="tel"
          />
        </Field>
        <Field label="E-mail">
          <input className="field-input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="seu@email.com" />
        </Field>
      </div>

      <hr className="border-border" />

      <div>
        <p className="text-xs tracking-[3px] text-terra uppercase mb-2 font-semibold">
          Etapa 2 — Sobre o imóvel
        </p>
        <h2 className="font-display text-2xl font-bold text-ink">Conte um pouco sobre ele</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tipo de imóvel *">
          <select className="field-input" value={form.property_type} onChange={(e) => update('property_type', e.target.value)}>
            {PROPERTY_TYPES.map((t) => (<option key={t}>{t}</option>))}
          </select>
        </Field>
        <Field label="Finalidade *">
          <select className="field-input" value={form.purpose} onChange={(e) => update('purpose', e.target.value)}>
            {PURPOSES.map((t) => (<option key={t}>{t}</option>))}
          </select>
        </Field>
      </div>

      <Field label="Endereço do imóvel *" required>
        <input
          className="field-input"
          value={form.property_address}
          onChange={(e) => update('property_address', e.target.value)}
          placeholder="Rua, número, bairro, cidade"
          required
        />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Quartos">
          <input className="field-input" type="number" min="0" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} placeholder="Ex: 3" />
        </Field>
        <Field label="Área (m²)">
          <input className="field-input" type="number" min="0" value={form.area} onChange={(e) => update('area', e.target.value)} placeholder="Ex: 120" />
        </Field>
        <Field label="Valor esperado">
          <input className="field-input" value={form.expected_value} onChange={(e) => update('expected_value', e.target.value)} placeholder="Ex: R$ 350.000" />
        </Field>
      </div>

      <Field label="Outras informações">
        <textarea
          className="field-textarea"
          value={form.property_details}
          onChange={(e) => update('property_details', e.target.value)}
          placeholder="Quintal, vagas de garagem, ano de construção, reformas recentes, condomínio..."
          rows={3}
        />
      </Field>

      <Field label="Mensagem (opcional)">
        <textarea
          className="field-textarea"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Algo mais que eu deveria saber? Melhor horário para te ligar?"
          rows={2}
        />
      </Field>

      <div className="bg-cream/50 border border-border rounded-xl p-4 flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          checked={form.consent}
          onChange={(e) => update('consent', e.target.checked)}
          className="mt-1 w-4 h-4 accent-terra cursor-pointer"
        />
        <label htmlFor="consent" className="text-xs text-ink-soft/80 leading-relaxed cursor-pointer">
          Concordo em ser contatado pelo Beto Baltazar Corretor para tratar do cadastro do meu imóvel,
          conforme a LGPD. Seus dados não serão compartilhados com terceiros sem sua autorização.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary btn-lg w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Send size={16} /> Enviar cadastro
          </>
        )}
      </button>

      <p className="text-xs text-ink-soft/60 flex items-center gap-2">
        <AlertCircle size={12} />
        Campos com <span className="text-terra">*</span> são obrigatórios.
      </p>
    </form>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="field-label">
        {label} {required && <span className="text-terra">*</span>}
      </label>
      {children}
    </div>
  );
}
