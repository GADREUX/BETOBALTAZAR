'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Building2, Users, FileSignature, Receipt,
  Target, Globe, ClipboardCheck, BarChart3, Inbox,
  LogOut, Menu, X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_SECTIONS = [
  {
    label: 'Visão Geral',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/submissoes', icon: Inbox, label: 'Solicitações' },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { href: '/admin/imoveis', icon: Building2, label: 'Imóveis' },
      { href: '/admin/proprietarios', icon: Users, label: 'Proprietários' },
      { href: '/admin/inquilinos', icon: Users, label: 'Inquilinos' },
    ],
  },
  {
    label: 'Operação',
    items: [
      { href: '/admin/contratos', icon: FileSignature, label: 'Contratos' },
      { href: '/admin/boletos', icon: Receipt, label: 'Boletos PIX' },
      { href: '/admin/vistorias', icon: ClipboardCheck, label: 'Vistorias' },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { href: '/admin/crm', icon: Target, label: 'CRM / Funil' },
      { href: '/admin/portais', icon: Globe, label: 'Portais' },
      { href: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' },
    ],
  },
];

export default function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Até logo!');
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream/30 flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[256px] bg-ink text-cream z-50 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-6 py-6 border-b border-cream/8">
          <div className="font-display text-xl font-bold leading-tight">Beto Baltazar</div>
          <div className="text-[10px] tracking-[2.5px] text-gold uppercase mt-1.5 font-medium">
            Painel do Corretor
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-3">
              <div className="text-[10px] tracking-[2.5px] text-cream/30 uppercase font-semibold px-5 mb-1 mt-3">
                {section.label}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2 ${
                      active
                        ? 'bg-white/8 text-paper border-terra font-medium'
                        : 'text-cream/55 border-transparent hover:bg-white/4 hover:text-cream/90'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.7} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-cream/8">
          <div className="text-xs text-cream/55 mb-3 truncate">{userEmail}</div>
          <button onClick={logout} className="w-full flex items-center gap-2 text-xs text-cream/60 hover:text-paper transition">
            <LogOut size={14} /> Sair da conta
          </button>
        </div>
      </aside>

      {/* Backdrop mobile */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          aria-label="Fechar menu"
        />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-[256px] min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-border sticky top-0 z-30 flex items-center px-6 md:px-8 justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-ink-soft" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <PageTitle pathname={pathname} />
          </div>
          <Link href="/" target="_blank" className="text-xs text-ink-soft hover:text-terra transition flex items-center gap-1">
            Ver site público →
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function PageTitle({ pathname }: { pathname: string }) {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/imoveis': 'Imóveis',
    '/admin/proprietarios': 'Proprietários',
    '/admin/inquilinos': 'Inquilinos',
    '/admin/contratos': 'Contratos de Locação',
    '/admin/boletos': 'Boletos PIX',
    '/admin/crm': 'CRM e Funil de Vendas',
    '/admin/vistorias': 'Vistorias',
    '/admin/portais': 'Integração com Portais',
    '/admin/relatorios': 'Relatórios',
    '/admin/submissoes': 'Solicitações do Site',
  };
  const title = titles[pathname] || Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] || 'Admin';
  return <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>;
}
