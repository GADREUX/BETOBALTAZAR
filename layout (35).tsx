import { Phone, Mail, MapPin, MessageCircle, Clock, Instagram, Facebook } from 'lucide-react';

export const metadata = {
  title: 'Contato — Beto Baltazar Corretor',
  description: 'Entre em contato com Beto Baltazar, corretor de imóveis em Capão Bonito/SP.',
};

export default function ContatoPage() {
  return (
    <div className="bg-paper min-h-screen">
      <section className="bg-gradient-to-b from-cream/30 to-paper border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Contato</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight max-w-2xl">
            Fale comigo<br />
            <em className="italic text-moss">diretamente.</em>
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://wa.me/5515996897738"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-terra hover:bg-terra-dark text-white rounded-2xl p-8 transition-all shadow-card hover:shadow-lift"
          >
            <MessageCircle size={32} className="mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">WhatsApp</h3>
            <p className="text-white/80 text-sm mb-4">A forma mais rápida de me alcançar.</p>
            <p className="text-lg font-semibold">(15) 99689-7738</p>
          </a>

          <a
            href="tel:+5515996897738"
            className="group bg-white border border-border hover:border-ink rounded-2xl p-8 transition-all"
          >
            <Phone size={32} className="text-ink mb-4" />
            <h3 className="font-display text-2xl font-bold text-ink mb-2">Telefone</h3>
            <p className="text-ink-soft/70 text-sm mb-4">Para uma conversa mais detalhada.</p>
            <p className="text-lg font-semibold text-ink">(15) 99689-7738</p>
          </a>

          <a
            href="mailto:betobaltazar@gmail.com"
            className="group bg-white border border-border hover:border-ink rounded-2xl p-8 transition-all"
          >
            <Mail size={32} className="text-moss mb-4" />
            <h3 className="font-display text-2xl font-bold text-ink mb-2">E-mail</h3>
            <p className="text-ink-soft/70 text-sm mb-4">Para documentos e propostas formais.</p>
            <p className="text-base font-semibold text-ink break-all">betobaltazar@gmail.com</p>
          </a>

          <div className="bg-white border border-border rounded-2xl p-8">
            <MapPin size={32} className="text-gold mb-4" />
            <h3 className="font-display text-2xl font-bold text-ink mb-2">Endereço</h3>
            <p className="text-ink-soft/70 text-sm mb-4">Atendo com hora marcada.</p>
            <p className="text-base font-semibold text-ink leading-relaxed">
              Rua Bernardino de Campos, 736<br />
              Centro · Capão Bonito/SP
            </p>
          </div>
        </div>

        <div className="card-base p-8 mt-6 flex items-start gap-4 bg-cream/40">
          <Clock size={24} className="text-moss shrink-0 mt-1" />
          <div>
            <h3 className="font-display text-lg font-semibold text-ink mb-2">Horário de atendimento</h3>
            <p className="text-sm text-ink-soft/80 leading-relaxed">
              <strong>Segunda a sexta:</strong> 8h às 19h<br />
              <strong>Sábado:</strong> 8h às 14h<br />
              <strong>Domingo:</strong> Apenas urgências via WhatsApp
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-xs text-ink-soft/65 mb-3">Me siga nas redes sociais</p>
          <div className="flex gap-3 justify-center">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white border border-border flex items-center justify-center hover:border-terra hover:text-terra text-ink-soft transition">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-white border border-border flex items-center justify-center hover:border-terra hover:text-terra text-ink-soft transition">
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
