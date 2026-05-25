'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Bed, Bath, Car, Maximize2, Filter, X } from 'lucide-react';
import { money } from '@/lib/utils';
import type { Property } from '@/types/database';

const PROPERTY_TYPES = ['Todos', 'Casa', 'Apartamento', 'Terreno', 'Comercial', 'Rural', 'Cobertura', 'Sobrado'];
const PURPOSES = ['Todos', 'Venda', 'Locação'];

export default function PropertyListing({
  properties,
  initialParams,
}: {
  properties: Property[];
  initialParams: { purpose?: string; type?: string; q?: string };
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialParams.q || '');
  const [purpose, setPurpose] = useState(initialParams.purpose || 'Todos');
  const [type, setType] = useState(initialParams.type || 'Todos');
  const [showFilters, setShowFilters] = useState(false);

  const apply = () => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (purpose !== 'Todos') p.set('purpose', purpose);
    if (type !== 'Todos') p.set('type', type);
    router.push(`/imoveis${p.toString() ? `?${p}` : ''}`);
  };

  const clear = () => {
    setSearch('');
    setPurpose('Todos');
    setType('Todos');
    router.push('/imoveis');
  };

  const hasFilters = search || purpose !== 'Todos' || type !== 'Todos';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
      {/* Filters */}
      <div className="card-base p-5 mb-10 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder="Buscar por bairro, título ou código..."
            className="field-input pl-11"
          />
        </div>

        <select className="field-input w-auto" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          {PURPOSES.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select className="field-input w-auto" value={type} onChange={(e) => setType(e.target.value)}>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>

        <button onClick={apply} className="btn-primary">
          <Filter size={14} /> Aplicar
        </button>

        {hasFilters && (
          <button onClick={clear} className="btn-ghost btn-sm">
            <X size={14} /> Limpar
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-2">
        <p className="text-sm text-ink-soft/70">
          <strong className="text-ink font-display text-xl">{properties.length}</strong>{' '}
          {properties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </p>
      </div>

      {/* Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="font-display text-2xl font-semibold text-ink mb-3">
            Nenhum imóvel encontrado
          </h3>
          <p className="text-ink-soft/70 mb-6">Tente ajustar os filtros ou buscar com outras palavras.</p>
          <button onClick={clear} className="btn-outline">Ver todos os imóveis</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const isRent = property.purpose === 'Locação';
  const priceLabel = isRent && property.rent ? `${money(property.rent)}/mês` : money(property.price);
  const photo = property.photos?.[0];

  return (
    <Link href={`/imoveis/${property.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-cream-dark/40 aspect-[4/5] mb-4">
        {photo ? (
          <Image
            src={photo}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream-dark to-moss-light/30 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-20 h-20 text-moss/30">
              <path d="M40 100 L100 40 L160 100 L160 160 L120 160 L120 120 L80 120 L80 160 L40 160 Z" fill="currentColor" />
            </svg>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="badge bg-white/95 text-ink backdrop-blur-sm shadow-soft">{property.purpose}</span>
          {property.is_featured && (<span className="badge bg-terra text-white">Destaque</span>)}
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
