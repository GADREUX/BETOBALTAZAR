import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import {
  ArrowRight, Search, MapPin, Bed, Bath, Car, Maximize2,
  Award, Shield, Heart, MessageCircle, Sparkles,
} from 'lucide-react';
import type { Property } from '@/types/database';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();
  const { data: featured } = await supabase
    .from('properties')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .limit(6);

  const { data: recent } = await supabase
    .from('properties')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(4);

  const { count: totalProps } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  return (
    <div className="bg-paper">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden grain bg-gradient-to-br from-paper via-cream/30 to-paper">
        {/* Decorative element */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-terra/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-moss/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-cream border border-border rounded-full px-4 py-1.5 mb-6">
                <Sparkles size={14} className="text-terra" />
                <span className="text-xs font-medium tracking-wide text-ink-soft">
                  Imóveis selecionados em Capão Bonito
                </span>
              </div>

              <h1 className="font-display font-bold text-ink leading-[1.02] tracking-tight text-5xl md:text-6xl lg:text-7xl mb-6">
                Encontre o lugar<br />
                onde sua história<br />
                <em className="font-display italic font-medium text-terra not-italic-decoration">acontece.</em>
              </h1>

              <p className="text-lg text-ink-soft/80 max-w-xl mb-10 leading-relaxed">
                Há anos conectando pessoas aos imóveis certos em Capão Bonito.
                Compra, venda e locação com cuidado, transparência e dedicação em cada detalhe.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <Link href="/imoveis" className="inline-flex items-center gap-2 bg-ink hover:bg-ink-soft text-paper px-7 py-3.5 rounded-lg text-sm font-medium transition-all shadow-card hover:shadow-lift group">
                  <Search size={16} />
                  Explorar Imóveis
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/anuncie" className="inline-flex items-center gap-2 bg-white border border-border hover:border-terra text-ink hover:text-terra px-7 py-3.5 rounded-lg text-sm font-medium transition-all">
                  Quero anunciar meu imóvel
                </Link>
              </div>

              <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
                <div>
                  <div className="font-display text-3xl font-bold text-ink">{totalProps ?? 0}+</div>
                  <div className="text-xs text-ink-soft/70 tracking-wide mt-1">Imóveis na carteira</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-ink">15+</div>
                  <div className="text-xs text-ink-soft/70 tracking-wide mt-1">Anos de experiência</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-ink">100%</div>
                  <div className="text-xs text-ink-soft/70 tracking-wide mt-1">Dedicação em cada negócio</div>
                </div>
              </div>
            </div>

            {/* Hero card stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] max-w-md mx-auto">
                {/* Back card */}
                <div className="absolute top-8 -right-4 w-full h-full bg-moss/10 border border-moss/20 rounded-3xl rotate-3" />
                {/* Middle card */}
                <div className="absolute top-4 -left-4 w-full h-full bg-terra/10 border border-terra/20 rounded-3xl -rotate-2" />
                {/* Front card */}
                <div className="relative w-full h-full bg-white rounded-3xl shadow-lift border border-border overflow-hidden flex flex-col">
                  <div className="flex-1 relative bg-gradient-to-br from-moss-light/30 via-cream to-terra-light/20 flex items-center justify-center">
                    <div className="absolute inset-0 grain opacity-20" />
                    <svg viewBox="0 0 200 200" className="w-32 h-32 text-moss/30">
                      <path
                        d="M40 100 L100 40 L160 100 L160 160 L120 160 L120 120 L80 120 L80 160 L40 160 Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="absolute top-4 left-4">
                      <span className="badge bg-ink text-paper">Destaque</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gold tracking-widest mb-2">CAPÃO BONITO • SP</div>
                    <h3 className="font-display text-xl font-bold text-ink mb-3">
                      Imóveis cuidadosamente selecionados
                    </h3>
                    <p className="text-sm text-ink-soft/70 leading-relaxed">
                      Cada imóvel é avaliado pessoalmente com atenção aos detalhes que fazem diferença.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALORES (3 pillars) ═══ */}
      <section className="py-20 md:py-28 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Por que nos escolher</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
              Imóveis tratados<br />
              com <em className="italic text-moss">cuidado de verdade</em>.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="text-terra" strokeWidth={1.5} size={32} />,
                title: 'Curadoria pessoal',
                text: 'Cada imóvel é visitado e avaliado pessoalmente. Você só vê opções que valem o seu tempo.',
              },
              {
                icon: <Shield className="text-moss" strokeWidth={1.5} size={32} />,
                title: 'Transparência total',
                text: 'Contratos claros, documentação revisada e nenhuma surpresa no caminho. Sem pegadinhas.',
              },
              {
                icon: <Heart className="text-gold" strokeWidth={1.5} size={32} />,
                title: 'Atendimento próximo',
                text: 'Acompanhamento humano e personalizado, do primeiro contato à entrega das chaves.',
              },
            ].map((item, i) => (
              <div key={i} className="group relative p-8 bg-cream/40 border border-border rounded-2xl hover:bg-white hover:shadow-card transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-xl border border-border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-ink">{item.title}</h3>
                <p className="text-sm text-ink-soft/75 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROPERTIES ═══ */}
      {featured && featured.length > 0 && (
        <section className="py-20 md:py-28 bg-paper">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">Destaques da carteira</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight max-w-2xl">
                  Imóveis em destaque<br />
                  para você conhecer.
                </h2>
              </div>
              <Link href="/imoveis" className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-terra transition group">
                Ver todos os imóveis
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p as Property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA: ANUNCIE SEU IMÓVEL ═══ */}
      <section className="py-20 md:py-28 bg-ink text-paper relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-terra/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-moss/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs tracking-[4px] text-gold uppercase mb-4 font-semibold">Para proprietários</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
                Tem um imóvel?<br />
                Vamos <em className="italic text-terra-light">encontrar o comprador certo</em>.
              </h2>
              <p className="text-lg text-cream/75 max-w-xl mb-10 leading-relaxed">
                Cadastre seu imóvel em poucos minutos. Eu mesmo entrarei em contato para conhecê-lo
                e definirmos a melhor estratégia de venda ou locação.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/anuncie" className="inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-white px-7 py-3.5 rounded-lg text-sm font-medium transition-all shadow-lift group">
                  Cadastrar meu imóvel
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="https://wa.me/5515996897738" target="_blank" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-cream/15 text-cream px-7 py-3.5 rounded-lg text-sm font-medium transition-all backdrop-blur">
                  <MessageCircle size={16} />
                  Conversar no WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: '01', t: 'Cadastre', d: 'Preencha os dados do imóvel no formulário' },
                  { n: '02', t: 'Conversamos', d: 'Entro em contato para visitar e avaliar' },
                  { n: '03', t: 'Divulgamos', d: 'Site, portais e nossa rede de contatos' },
                  { n: '04', t: 'Negociamos', d: 'Cuido de toda a parte burocrática' },
                ].map((s) => (
                  <div key={s.n} className="bg-white/5 border border-cream/10 rounded-2xl p-5 backdrop-blur">
                    <div className="font-display text-3xl text-gold mb-2">{s.n}</div>
                    <div className="font-medium text-paper mb-1.5">{s.t}</div>
                    <div className="text-xs text-cream/60 leading-relaxed">{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RECENT ═══ */}
      {recent && recent.length > 0 && (
        <section className="py-20 md:py-24 bg-paper">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
                Adicionados recentemente
              </h2>
              <Link href="/imoveis" className="text-sm font-medium text-terra hover:text-terra-dark transition flex items-center gap-2 group">
                Ver todos
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recent.map((p) => (
                <PropertyCard key={p.id} property={p as Property} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Property Card ───────────────────────────────────────────
function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const isRent = property.purpose === 'Locação';
  const priceLabel = isRent && property.rent ? `${money(property.rent)}/mês` : money(property.price);
  const photo = property.photos?.[0];

  return (
    <Link href={`/imoveis/${property.id}`} className="group block">
      <div className={`relative overflow-hidden rounded-2xl bg-cream-dark/40 ${compact ? 'aspect-[4/3]' : 'aspect-[4/5]'} mb-4`}>
        {photo ? (
          <Image
            src={photo}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream-dark to-moss-light/30 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-20 h-20 text-moss/30">
              <path
                d="M40 100 L100 40 L160 100 L160 160 L120 160 L120 120 L80 120 L80 160 L40 160 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="badge bg-white/95 text-ink backdrop-blur-sm shadow-soft">
            {property.purpose}
          </span>
          {property.is_featured && (
            <span className="badge bg-terra text-white">Destaque</span>
          )}
        </div>

        {property.code && (
          <span className="absolute top-3 right-3 text-[10px] font-mono tracking-wider bg-black/50 text-white px-2 py-1 rounded backdrop-blur-sm">
            #{property.code}
          </span>
        )}
      </div>

      <div className="px-1">
        <div className="flex items-center gap-1 text-xs text-ink-soft/60 mb-1.5">
          <MapPin size={11} />
          <span>{property.neighborhood}, {property.city}/{property.state}</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-terra transition-colors line-clamp-2 leading-tight mb-2">
          {property.title}
        </h3>
        <div className="font-display text-xl font-bold text-ink mb-3">{priceLabel}</div>

        <div className="flex items-center gap-3 text-xs text-ink-soft/70 pt-3 border-t border-border-soft">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms}</span>
          )}
          <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Car size={13} /> {property.parking}</span>
          <span className="flex items-center gap-1 ml-auto"><Maximize2 size={13} /> {property.area}m²</span>
        </div>
      </div>
    </Link>
  );
}
