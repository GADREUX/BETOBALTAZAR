import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { money, fmtDate, daysUntil, timeAgo } from '@/lib/utils';
import {
  Building2, FileSignature, DollarSign, Bell, Target, Tag,
  TrendingUp, Inbox, ArrowRight, AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { data: properties },
    { data: contracts },
    { data: boletos },
    { data: leads },
    { data: submissions },
  ] = await Promise.all([
    supabase.from('properties').select('*'),
    supabase.from('contracts').select('*'),
    supabase.from('boletos').select('*'),
    supabase.from('leads').select('*'),
    supabase.from('submissions').select('*').eq('status', 'Novo').order('created_at', { ascending: false }),
  ]);

  const P = properties || [];
  const C = contracts || [];
  const B = boletos || [];
  const L = leads || [];
  const S = submissions || [];

  const totalValue = P.reduce((s, p) => s + (p.price || 0), 0);
  const activeContracts = C.filter((c) => c.status === 'Ativo').length;
  const monthlyRent = C.filter((c) => c.status === 'Ativo').reduce((s, c) => s + (c.rent_value || 0), 0);
  const pendingBoletos = B.filter((b) => b.status === 'Pendente');
  const overdueBoletos = pendingBoletos.filter((b) => (daysUntil(b.due_date) ?? 0) < 0);
  const openLeads = L.filter((l) => !['Fechado', 'Perdido'].includes(l.stage)).length;
  const closedLeads = L.filter((l) => l.stage === 'Fechado').length;
  const conversion = L.length ? Math.round((closedLeads / L.length) * 100) : 0;

  const CRM_STAGES = ['Novo Lead', 'Contato Feito', 'Visita Agendada', 'Proposta', 'Negociação', 'Fechado', 'Perdido'];
  const stageData = CRM_STAGES.map((s) => ({ s, n: L.filter((l) => l.stage === s).length }));
  const maxStage = Math.max(...stageData.map((s) => s.n), 1);
  const stageColors: Record<string, string> = {
    'Novo Lead': 'bg-blue', 'Contato Feito': 'bg-moss', 'Visita Agendada': 'bg-yellow',
    'Proposta': 'bg-terra', 'Negociação': 'bg-gold', 'Fechado': 'bg-green', 'Perdido': 'bg-red',
  };

  const stats = [
    { v: P.length, l: 'Imóveis', sub: `${P.filter(p=>p.status==='Disponível').length} disponíveis`, icon: Building2, bg: 'bg-blue/8', color: 'text-blue', href: '/admin/imoveis' },
    { v: activeContracts, l: 'Contratos ativos', sub: `${C.length} total`, icon: FileSignature, bg: 'bg-moss/8', color: 'text-moss', href: '/admin/contratos' },
    { v: money(monthlyRent), l: 'Receita mensal', sub: 'aluguéis ativos', icon: DollarSign, bg: 'bg-gold/10', color: 'text-gold', href: '/admin/boletos' },
    { v: pendingBoletos.length, l: 'Boletos pendentes', sub: overdueBoletos.length > 0 ? `${overdueBoletos.length} vencido(s)` : 'em dia', icon: Bell, bg: overdueBoletos.length ? 'bg-red/8' : 'bg-yellow/8', color: overdueBoletos.length ? 'text-red' : 'text-yellow', href: '/admin/boletos' },
    { v: openLeads, l: 'Leads em aberto', sub: `${conversion}% conversão`, icon: Target, bg: 'bg-terra/8', color: 'text-terra', href: '/admin/crm' },
    { v: money(totalValue), l: 'Carteira total', sub: 'valor em venda', icon: Tag, bg: 'bg-ink/5', color: 'text-ink', href: '/admin/relatorios' },
  ];

  return (
    <div className="space-y-8">
      {/* Submissions alert */}
      {S.length > 0 && (
        <Link href="/admin/submissoes" className="block bg-terra text-white rounded-2xl p-5 hover:bg-terra-dark transition shadow-card">
          <div className="flex items-center gap-4">
            <Inbox size={28} />
            <div className="flex-1">
              <div className="font-display text-xl font-bold">
                {S.length} {S.length === 1 ? 'nova solicitação' : 'novas solicitações'} no site
              </div>
              <div className="text-sm text-white/85 mt-0.5">
                {S[0].name} cadastrou um imóvel {timeAgo(S[0].created_at)}
              </div>
            </div>
            <ArrowRight size={20} />
          </div>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Link key={i} href={s.href} className="group bg-white border border-border rounded-2xl p-6 hover:shadow-card transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                <s.icon size={20} strokeWidth={1.7} />
              </div>
              <ArrowRight size={14} className="text-ink-soft/30 group-hover:text-terra group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="font-display text-3xl font-bold text-ink leading-none">{s.v}</div>
            <div className="text-sm text-ink-soft mt-1.5">{s.l}</div>
            <div className="text-xs text-ink-soft/60 mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funil */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Funil de Vendas</h3>
              <p className="text-xs text-ink-soft/60 mt-0.5">{L.length} leads · {conversion}% de conversão</p>
            </div>
            <Link href="/admin/crm" className="text-xs text-terra hover:underline">Ver CRM →</Link>
          </div>
          <div className="space-y-3">
            {stageData.map((s) => (
              <div key={s.s} className="flex items-center gap-3 text-sm">
                <div className="w-28 text-xs text-ink-soft/70 text-right shrink-0">{s.s}</div>
                <div className="flex-1 h-7 bg-cream rounded-md overflow-hidden">
                  <div
                    className={`h-full ${stageColors[s.s]} flex items-center pl-3 text-xs font-semibold text-white transition-all duration-700`}
                    style={{ width: `${Math.max((s.n / maxStage) * 100, s.n > 0 ? 6 : 0)}%` }}
                  >
                    {s.n > 0 ? s.n : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending boletos */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Boletos Pendentes</h3>
              <p className="text-xs text-ink-soft/60 mt-0.5">
                {pendingBoletos.length} pendentes · {money(pendingBoletos.reduce((s,b)=>s+b.value,0))}
              </p>
            </div>
            <Link href="/admin/boletos" className="text-xs text-terra hover:underline">Ver todos →</Link>
          </div>

          {pendingBoletos.length === 0 ? (
            <div className="text-center py-10 text-ink-soft/60 text-sm">
              ✓ Nenhum boleto pendente
            </div>
          ) : (
            <div className="space-y-2">
              {pendingBoletos.slice(0, 5).map((b) => {
                const days = daysUntil(b.due_date);
                const overdue = (days ?? 0) < 0;
                return (
                  <div key={b.id} className="flex items-center justify-between py-2.5 px-3 hover:bg-cream rounded-lg transition">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{money(b.value)}</div>
                      <div className="text-xs text-ink-soft/60">Vence {fmtDate(b.due_date)}</div>
                    </div>
                    <span className={`badge ${overdue ? 'bg-red/10 text-red' : 'bg-yellow/10 text-yellow'}`}>
                      {overdue ? `${Math.abs(days!)}d atraso` : days === 0 ? 'Hoje' : `${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent submissions */}
      {S.length > 0 && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-semibold text-ink">Últimas solicitações do site</h3>
            <Link href="/admin/submissoes" className="text-xs text-terra hover:underline">Ver todas →</Link>
          </div>
          <div className="divide-y divide-border">
            {S.slice(0, 4).map((s) => (
              <Link key={s.id} href={`/admin/submissoes`} className="flex items-center justify-between py-3.5 hover:bg-cream/40 px-3 -mx-3 rounded transition">
                <div>
                  <div className="font-medium text-sm text-ink">{s.name}</div>
                  <div className="text-xs text-ink-soft/65 mt-0.5">
                    {s.property_type} para {s.purpose} · {s.phone}
                  </div>
                </div>
                <div className="text-xs text-ink-soft/55">{timeAgo(s.created_at)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
