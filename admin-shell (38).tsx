import AnuncieForm from './anuncie-form';
import { Award, Clock, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Anuncie seu Imóvel — Beto Baltazar Corretor',
  description: 'Cadastre seu imóvel para venda ou locação em Capão Bonito. Atendimento personalizado.',
};

export default function AnunciePage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-cream via-paper to-cream/40 border-b border-border overflow-hidden grain">
        <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-terra/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20 relative">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[4px] text-terra uppercase mb-4 font-semibold">
              Para proprietários
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] text-ink mb-6">
              Cadastre seu imóvel<br />
              em <em className="italic text-moss">poucos minutos</em>.
            </h1>
            <p className="text-lg text-ink-soft/80 leading-relaxed max-w-2xl">
              Preencha o formulário abaixo com as informações do seu imóvel. Eu entrarei em contato
              o mais rápido possível para conversarmos sobre a melhor estratégia de venda ou locação.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 grid lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <AnuncieForm />
        </div>

        {/* Side */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="card-base p-7">
              <h3 className="font-display text-2xl font-bold text-ink mb-4">
                Como funciona?
              </h3>
              <ol className="space-y-5">
                {[
                  { n: '01', t: 'Você preenche o formulário', d: 'Com as informações principais do imóvel — fotos podem ser enviadas depois.' },
                  { n: '02', t: 'Recebo a notificação', d: 'No mesmo dia entro em contato pelo telefone informado.' },
                  { n: '03', t: 'Avalio pessoalmente', d: 'Visito o imóvel para conhecer e definirmos o valor ideal.' },
                  { n: '04', t: 'Começamos a divulgar', d: 'Site, portais imobiliários e nossa rede de contatos.' },
                ].map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-cream border border-border flex items-center justify-center font-display text-sm font-bold text-terra">
                      {s.n}
                    </div>
                    <div>
                      <div className="font-medium text-ink mb-1">{s.t}</div>
                      <p className="text-sm text-ink-soft/70 leading-relaxed">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-ink text-paper rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-terra/15 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <Award size={20} className="text-gold" />
                  <p className="text-xs tracking-widest text-gold/90 uppercase font-semibold">CRECI 318284-F</p>
                </div>
                <p className="font-display text-xl font-semibold mb-4 leading-snug">
                  Corretor com mais de 15 anos atuando em Capão Bonito.
                </p>
                <a
                  href="https://wa.me/5515996897738"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-cream/15 text-cream px-5 py-2.5 rounded-lg text-sm font-medium transition backdrop-blur"
                >
                  <MessageCircle size={15} />
                  Falar direto no WhatsApp
                </a>
              </div>
            </div>

            <div className="flex gap-3 items-start p-5 bg-moss/5 border border-moss/15 rounded-xl">
              <Clock size={20} className="text-moss shrink-0 mt-0.5" />
              <p className="text-sm text-ink-soft leading-relaxed">
                <strong className="text-ink">Retorno em até 24h.</strong>{' '}
                Atendimento de segunda a sábado, das 8h às 19h.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
