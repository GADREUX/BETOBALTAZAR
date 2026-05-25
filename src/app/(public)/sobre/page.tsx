import Link from 'next/link';
import { Award, Shield, Heart, MapPin, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Sobre — Beto Baltazar Corretor',
  description: 'Conheça a história e o trabalho do Beto Baltazar, corretor de imóveis em Capão Bonito/SP.',
};

export default function SobrePage() {
  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden grain bg-gradient-to-br from-cream/40 via-paper to-cream/40 border-b border-border">
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-terra/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-moss/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs tracking-[4px] text-terra uppercase mb-4 font-semibold">
                Quem é
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] text-ink mb-6">
                Beto Baltazar.<br />
                <em className="italic font-medium text-moss">Corretor por vocação.</em>
              </h1>
              <p className="text-lg text-ink-soft/80 leading-relaxed max-w-xl">
                Há mais de 15 anos ajudando famílias e empreendedores a encontrarem o imóvel certo
                em Capão Bonito. Trabalho com a transparência de quem conhece a cidade pelo nome,
                rua por rua.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 bg-terra/10 rounded-full blur-2xl" />
                <div className="relative w-full h-full bg-gradient-to-br from-cream via-cream-dark to-moss-light/30 rounded-full border-2 border-border flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-7xl text-ink/30 mb-2">BB</div>
                    <div className="text-[10px] tracking-[3px] text-gold uppercase">CRECI 318284-F</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-24 bg-white border-y border-border">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <p className="text-xs tracking-[4px] text-terra uppercase mb-4 font-semibold">A trajetória</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 leading-tight">
            Imóveis vão além de paredes e metros quadrados.
          </h2>
          <div className="space-y-5 text-lg text-ink-soft/85 leading-relaxed">
            <p>
              Cada imóvel guarda uma história — e é capaz de começar outras. Foi essa percepção
              que me fez escolher essa profissão.
            </p>
            <p>
              Em Capão Bonito conheço bairros, ruas e famílias. Esse conhecimento de
              quem está aqui há tempo é o que permite encontrar não só um imóvel disponível,
              mas o imóvel <em className="italic text-terra">certo</em> para cada pessoa.
            </p>
            <p>
              Trabalho sozinho, com dedicação e cuidado em cada negociação. Sem equipe terceirizada,
              sem promessa vazia. Você fala comigo do primeiro contato à entrega das chaves.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-24 bg-paper">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs tracking-[4px] text-moss uppercase mb-3 font-semibold">Como eu trabalho</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
              Três valores<br />
              <em className="italic text-terra">inegociáveis.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="text-terra" strokeWidth={1.5} size={32} />,
                title: 'Curadoria',
                text: 'Não anuncio qualquer imóvel. Cada propriedade é visitada e avaliada pessoalmente antes de entrar na carteira.',
              },
              {
                icon: <Shield className="text-moss" strokeWidth={1.5} size={32} />,
                title: 'Transparência',
                text: 'Documentação revisada, contratos claros e nenhuma informação omitida. Você sabe exatamente onde está pisando.',
              },
              {
                icon: <Heart className="text-gold" strokeWidth={1.5} size={32} />,
                title: 'Dedicação',
                text: 'Acompanho cada negociação como se fosse a primeira. Sem pressa para fechar e sem deixar você sem resposta.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-8">
                <div className="w-14 h-14 bg-cream rounded-xl border border-border flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-ink">{item.title}</h3>
                <p className="text-sm text-ink-soft/75 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-ink text-paper relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terra/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 md:px-8 relative text-center">
          <Sparkles className="text-gold mx-auto mb-4" size={28} />
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
            Vamos conversar?
          </h2>
          <p className="text-lg text-cream/75 mb-10 max-w-2xl mx-auto">
            Seja para comprar, vender ou alugar, o primeiro passo é uma boa conversa.
            Estou à disposição.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/5515996897738" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-white px-7 py-3.5 rounded-lg text-sm font-medium transition-all shadow-lift">
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
            <Link href="/imoveis" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-cream/15 text-cream px-7 py-3.5 rounded-lg text-sm font-medium transition backdrop-blur group">
              Ver imóveis
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
