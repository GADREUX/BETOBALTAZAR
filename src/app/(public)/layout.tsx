import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import GestorButton from '@/components/gestor-button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <GestorButton />
      {/* Top contact bar */}
      <div className="bg-ink text-cream text-xs py-2.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex gap-6 opacity-90">
            <a href="tel:+5515996897738" className="flex items-center gap-1.5 hover:text-gold transition">
              <Phone size={12} /> (15) 99689-7738
            </a>
            <a href="mailto:betobaltazar@gmail.com" className="flex items-center gap-1.5 hover:text-gold transition">
              <Mail size={12} /> betobaltazar@gmail.com
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> Capão Bonito - SP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gold/80 tracking-widest text-[10px]">CRECI 318284-F</span>
            <div className="w-px h-3 bg-cream/20" />
            <a href="https://instagram.com" target="_blank" className="hover:text-gold transition" aria-label="Instagram">
              <Instagram size={13} />
            </a>
            <a href="https://facebook.com" target="_blank" className="hover:text-gold transition" aria-label="Facebook">
              <Facebook size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              Beto Baltazar
            </span>
            <span className="text-[10px] tracking-[3px] text-terra uppercase font-medium mt-1">
              Corretor de Imóveis
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/', label: 'Início' },
              { href: '/imoveis', label: 'Imóveis' },
              { href: '/anuncie', label: 'Anuncie seu Imóvel' },
              { href: '/sobre', label: 'Sobre' },
              { href: '/contato', label: 'Contato' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-soft hover:text-terra transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-terra transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <a
            href="https://wa.me/5515996897738"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-soft hover:shadow-card"
          >
            <MessageCircle size={16} />
            Falar agora
          </a>

          {/* Mobile menu trigger */}
          <button className="md:hidden text-ink p-2" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-ink text-cream/85 mt-24">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="font-display text-2xl font-bold text-paper mb-1">Beto Baltazar</div>
              <div className="text-[10px] tracking-[3px] text-gold uppercase mb-4">Corretor de Imóveis</div>
              <p className="text-sm leading-relaxed text-cream/70 max-w-md mb-4">
                Corretor de imóveis em Capão Bonito/SP, com dedicação e cuidado em cada negociação.
                Compra, venda e locação com transparência e segurança.
              </p>
              <p className="text-xs text-gold/80 tracking-widest">CRECI 318284-F</p>
            </div>

            <div>
              <h4 className="font-display text-base font-semibold text-paper mb-4">Navegação</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/" className="hover:text-gold transition">Início</Link></li>
                <li><Link href="/imoveis" className="hover:text-gold transition">Imóveis</Link></li>
                <li><Link href="/anuncie" className="hover:text-gold transition">Anuncie seu Imóvel</Link></li>
                <li><Link href="/sobre" className="hover:text-gold transition">Sobre</Link></li>
                <li><Link href="/contato" className="hover:text-gold transition">Contato</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-base font-semibold text-paper mb-4">Contato</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5 shrink-0 text-gold" /><a href="tel:+5515996897738" className="hover:text-gold transition">(15) 99689-7738</a></li>
                <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5 shrink-0 text-gold" /><a href="mailto:betobaltazar@gmail.com" className="hover:text-gold transition break-all">betobaltazar@gmail.com</a></li>
                <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-gold" /><span>Rua Bernardino de Campos, 736<br/>Centro — Capão Bonito/SP</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/50">
            <p>© {new Date().getFullYear()} Beto Baltazar Corretor de Imóveis. Todos os direitos reservados.</p>
            <p>CRECI 318284-F · Capão Bonito/SP</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
