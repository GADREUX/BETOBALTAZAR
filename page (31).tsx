import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import { templates, whatsappUrl } from '@/lib/whatsapp';
import {
  Bed, Bath, Car, Maximize2, MapPin, ArrowLeft, MessageCircle,
  Mail, Phone, Sparkles, CheckCircle2,
} from 'lucide-react';

interface PageProps { params: { id: string } }

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClient();
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .eq('is_published', true)
    .single();

  if (!property) return { title: 'Imóvel não encontrado' };

  return {
    title: `${property.title} — Beto Baltazar Corretor`,
    description: property.description?.slice(0, 160) || `${property.title} em ${property.city}/${property.state}`,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const supabase = createClient();
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .eq('is_published', true)
    .single();

  if (!property) notFound();

  const isRent = property.purpose === 'Locação';
  const priceLabel = isRent && property.rent ? `${money(property.rent)}/mês` : money(property.price);

  const waUrl = whatsappUrl(
    '5515996897738',
    templates.propertyShare({
      title: property.title,
      neighborhood: property.neighborhood || '',
      city: property.city,
      state: property.state,
      price: priceLabel,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking: property.parking,
      area: property.area,
      description: property.description || '',
    })
  );

  const photos: string[] = property.photos?.length > 0 ? property.photos : [];

  return (
    <div className="bg-paper">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-6">
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-terra transition mb-6">
          <ArrowLeft size={14} /> Voltar para imóveis
        </Link>
      </div>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
        {photos.length === 0 ? (
          <div className="aspect-[16/9] rounded-3xl bg-gradient-to-br from-cream via-cream-dark to-moss-light/30 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-32 h-32 text-moss/30">
              <path d="M40 100 L100 40 L160 100 L160 160 L120 160 L120 120 L80 120 L80 160 L40 160 Z" fill="currentColor" />
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden aspect-[16/9]">
            <div className="col-span-2 row-span-2 relative">
              <Image src={photos[0]} alt={property.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
            {photos.slice(1, 5).map((url, i) => (
              <div key={i} className="relative bg-cream">
                <Image src={url} alt={`${property.title} ${i+2}`} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                {i === 3 && photos.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                    +{photos.length - 5} fotos
                  </div>
                )}
              </div>
            ))}
            {/* Fill empty slots if fewer photos */}
            {photos.length < 5 && Array.from({ length: 5 - photos.length }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-cream/50" />
            ))}
          </div>
        )}
      </section>

      {/* Info */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20 grid lg:grid-cols-12 gap-10">
        {/* Main */}
        <div className="lg:col-span-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-cream text-ink border border-border">{property.purpose}</span>
            <span className="badge bg-cream text-ink border border-border">{property.type}</span>
            {property.is_featured && (
              <span className="badge bg-terra text-white">
                <Sparkles size={11} className="mr-1" /> Destaque
              </span>
            )}
            {property.code && (
              <span className="badge bg-ink/5 text-ink-soft font-mono">#{property.code}</span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight tracking-tight mb-3">
            {property.title}
          </h1>

          <div className="flex items-center gap-1.5 text-ink-soft/70 mb-8">
            <MapPin size={15} />
            <span>{property.address}{property.address ? ', ' : ''}{property.neighborhood} — {property.city}/{property.state}</span>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { icon: <Bed size={20} />, label: 'Quartos', value: property.bedrooms || '—' },
              { icon: <Bath size={20} />, label: 'Banheiros', value: property.bathrooms },
              { icon: <Car size={20} />, label: 'Vagas', value: property.parking },
              { icon: <Maximize2 size={20} />, label: 'Área', value: `${property.area}m²` },
            ].map((spec, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-5 text-center">
                <div className="flex justify-center text-terra mb-2">{spec.icon}</div>
                <div className="font-display text-2xl font-bold text-ink">{spec.value}</div>
                <div className="text-xs text-ink-soft/70 mt-0.5">{spec.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Sobre o imóvel</h2>
              <p className="text-ink-soft/85 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {/* Features */}
          {property.features?.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">Características</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {property.features.map((f: string) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-ink-soft py-1.5">
                    <CheckCircle2 size={16} className="text-moss shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra fees */}
          {(property.iptu > 0 || property.condo_fee > 0) && (
            <div className="bg-cream/40 border border-border rounded-xl p-5">
              <p className="text-xs text-ink-soft/60 mb-3 tracking-wide uppercase font-medium">
                Custos adicionais
              </p>
              <div className="flex gap-8">
                {property.iptu > 0 && (
                  <div>
                    <div className="text-xs text-ink-soft/70">IPTU anual</div>
                    <div className="font-display text-lg font-semibold text-ink">{money(property.iptu)}</div>
                  </div>
                )}
                {property.condo_fee > 0 && (
                  <div>
                    <div className="text-xs text-ink-soft/70">Condomínio</div>
                    <div className="font-display text-lg font-semibold text-ink">{money(property.condo_fee)}/mês</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - contact CTA */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="card-base p-7 mb-4">
              <p className="text-xs tracking-wide text-ink-soft/60 uppercase mb-1">
                {isRent ? 'Aluguel' : 'Valor'}
              </p>
              <div className="font-display text-3xl font-bold text-ink mb-1">{priceLabel}</div>
              {!isRent && property.iptu > 0 && (
                <p className="text-xs text-ink-soft/60 mb-6">IPTU: {money(property.iptu)}/ano</p>
              )}

              <div className="border-t border-border my-5" />

              <h3 className="font-display text-lg font-semibold text-ink mb-1">
                Tem interesse?
              </h3>
              <p className="text-sm text-ink-soft/70 mb-5">
                Fale direto com o Beto e tire suas dúvidas.
              </p>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-terra hover:bg-terra-dark text-white px-5 py-3 rounded-lg text-sm font-medium transition shadow-soft hover:shadow-card mb-2"
              >
                <MessageCircle size={16} />
                Falar no WhatsApp
              </a>

              <a
                href="tel:+5515996897738"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-cream border border-border text-ink px-5 py-3 rounded-lg text-sm font-medium transition mb-2"
              >
                <Phone size={15} />
                (15) 99689-7738
              </a>

              <a
                href={`mailto:betobaltazar@gmail.com?subject=Interesse no imóvel ${property.title}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-cream border border-border text-ink px-5 py-3 rounded-lg text-sm font-medium transition"
              >
                <Mail size={15} />
                Enviar e-mail
              </a>
            </div>

            <div className="bg-ink text-paper rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
              <div className="relative">
                <p className="text-[10px] tracking-[3px] text-gold uppercase font-semibold mb-2">CRECI 318284-F</p>
                <p className="font-display text-lg font-semibold leading-snug mb-1">Beto Baltazar</p>
                <p className="text-sm text-cream/70">Corretor de Imóveis em Capão Bonito/SP</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
