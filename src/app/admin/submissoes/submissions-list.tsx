'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { whatsappUrl, templates } from '@/lib/whatsapp';
import { timeAgo, fmtDateTime, fmtPhone } from '@/lib/utils';
import {
  Inbox, MessageCircle, CheckCircle2, Eye, Target,
  Phone, Mail, MapPin, Building2, ChevronDown, ChevronUp,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Submission } from '@/types/database';

export default function SubmissionsList({ initial }: { initial: Submission[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<'Todas' | 'Novo' | 'Visto' | 'Convertido'>('Todas');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = items.filter((s) => filter === 'Todas' || s.status === filter);
  const counts = {
    Todas: items.length,
    Novo: items.filter((s) => s.status === 'Novo').length,
    Visto: items.filter((s) => s.status === 'Visto').length,
    Convertido: items.filter((s) => s.status === 'Convertido').length,
  };

  async function markAsSeen(id: string) {
    const supabase = createClient();
    await supabase.from('submissions').update({ status: 'Visto' }).eq('id', id);
    setItems((p) => p.map((s) => (s.id === id ? { ...s, status: 'Visto' } : s)));
    toast.success('Marcada como vista');
  }

  async function convertToLead(s: Submission) {
    const supabase = createClient();
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: s.name,
        phone: s.phone,
        email: s.email,
        interest: `${s.property_type} para ${s.purpose} em ${s.property_address}`,
        source: 'Site',
        stage: 'Novo Lead',
        notes: s.property_details,
      })
      .select()
      .single();

    if (error || !lead) {
      toast.error('Erro ao converter');
      return;
    }

    await supabase
      .from('submissions')
      .update({ status: 'Convertido', converted_to_lead_id: lead.id })
      .eq('id', s.id);

    setItems((p) => p.map((it) => (it.id === s.id ? { ...it, status: 'Convertido', converted_to_lead_id: lead.id } : it)));
    toast.success('Lead criado no CRM!');
    router.refresh();
  }

  async function del(id: string) {
    if (!confirm('Excluir esta solicitação?')) return;
    const supabase = createClient();
    await supabase.from('submissions').delete().eq('id', id);
    setItems((p) => p.filter((s) => s.id !== id));
    toast.success('Solicitação excluída');
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['Todas', 'Novo', 'Visto', 'Convertido'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-ink text-paper'
                : 'bg-white border border-border text-ink-soft hover:bg-cream'
            }`}
          >
            {f}
            <span className={`ml-2 text-xs ${filter === f ? 'text-cream/70' : 'text-ink-soft/50'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card-base p-16 text-center">
          <Inbox size={40} className="text-ink-soft/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-ink mb-1">
            Nenhuma solicitação
          </h3>
          <p className="text-sm text-ink-soft/65">
            Quando alguém preencher o formulário no site, aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const isExpanded = expanded === s.id;
            return (
              <div key={s.id} className="card-base overflow-hidden">
                <div
                  onClick={() => setExpanded(isExpanded ? null : s.id)}
                  className="p-5 cursor-pointer hover:bg-cream/30 transition flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    s.status === 'Novo' ? 'bg-terra/10 text-terra' :
                    s.status === 'Convertido' ? 'bg-green/10 text-green' : 'bg-cream text-ink-soft'
                  }`}>
                    {s.status === 'Convertido' ? <CheckCircle2 size={18} /> : <Inbox size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-ink">{s.name}</span>
                      {s.status === 'Novo' && (
                        <span className="badge bg-terra text-white">Novo</span>
                      )}
                      {s.status === 'Convertido' && (
                        <span className="badge bg-green/10 text-green">Convertido em lead</span>
                      )}
                    </div>
                    <div className="text-xs text-ink-soft/65 mt-0.5 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><Building2 size={11} /> {s.property_type} · {s.purpose}</span>
                      <span>·</span>
                      <span>{timeAgo(s.created_at)}</span>
                    </div>
                  </div>

                  <div className="hidden sm:block text-xs text-ink-soft/55 text-right">
                    {fmtPhone(s.phone)}
                  </div>

                  {isExpanded ? <ChevronUp size={18} className="text-ink-soft/50" /> : <ChevronDown size={18} className="text-ink-soft/50" />}
                </div>

                {isExpanded && (
                  <div className="border-t border-border bg-cream/20 p-6 animate-fade-in">
                    <div className="grid sm:grid-cols-3 gap-5 mb-5">
                      <Info icon={<Phone size={14} />} label="Telefone" value={fmtPhone(s.phone)} />
                      {s.email && <Info icon={<Mail size={14} />} label="E-mail" value={s.email} />}
                      {s.property_address && <Info icon={<MapPin size={14} />} label="Endereço" value={s.property_address} />}
                    </div>

                    {s.property_details && (
                      <div className="mb-5">
                        <div className="text-xs text-ink-soft/60 uppercase tracking-wider font-medium mb-2">
                          Detalhes
                        </div>
                        <p className="text-sm text-ink whitespace-pre-line bg-white border border-border rounded-xl p-4">
                          {s.property_details}
                        </p>
                      </div>
                    )}

                    {s.message && (
                      <div className="mb-5">
                        <div className="text-xs text-ink-soft/60 uppercase tracking-wider font-medium mb-2">
                          Mensagem
                        </div>
                        <p className="text-sm text-ink whitespace-pre-line bg-white border border-border rounded-xl p-4 italic">
                          "{s.message}"
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-ink-soft/50 mb-5">
                      Recebido em {fmtDateTime(s.created_at)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={whatsappUrl(s.phone, templates.leadFirstContact({
                          leadName: s.name,
                          interest: `cadastro de ${s.property_type} para ${s.purpose}`,
                        }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary btn-sm"
                      >
                        <MessageCircle size={13} /> Contatar via WhatsApp
                      </a>

                      {s.status !== 'Convertido' && (
                        <button onClick={() => convertToLead(s)} className="btn-secondary btn-sm">
                          <Target size={13} /> Converter em Lead
                        </button>
                      )}

                      {s.status === 'Novo' && (
                        <button onClick={() => markAsSeen(s.id)} className="btn-outline btn-sm">
                          <Eye size={13} /> Marcar como visto
                        </button>
                      )}

                      <a href={`tel:${s.phone}`} className="btn-outline btn-sm">
                        <Phone size={13} /> Ligar
                      </a>

                      {s.email && (
                        <a href={`mailto:${s.email}`} className="btn-outline btn-sm">
                          <Mail size={13} /> E-mail
                        </a>
                      )}

                      <button onClick={() => del(s.id)} className="btn-ghost btn-sm text-red ml-auto">
                        <Trash2 size={13} /> Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-ink-soft/60 uppercase tracking-wider font-medium mb-1 flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="text-sm text-ink break-words">{value}</div>
    </div>
  );
}
