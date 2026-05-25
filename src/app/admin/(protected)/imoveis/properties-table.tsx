'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { money, fmtDate } from '@/lib/utils';
import { Search, Edit2, Trash2, Eye, MessageCircle, Globe, Building2 } from 'lucide-react';
import { whatsappUrl, templates } from '@/lib/whatsapp';
import toast from 'react-hot-toast';

export default function PropertiesTable({ properties: initial }: { properties: any[] }) {
  const router = useRouter();
  const [properties, setProperties] = useState(initial);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');

  const filtered = properties.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.includes(search);
    const matchFilter =
      filter === 'Todos' || p.purpose === filter || p.status === filter || p.type === filter;
    return matchSearch && matchFilter;
  });

  async function del(id: string, title: string) {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?\nEsta ação não pode ser desfeita.`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) { toast.error('Erro ao excluir.'); return; }

    setProperties((prev) => prev.filter((p) => p.id !== id));
    toast.success('Imóvel excluído');
    router.refresh();
  }

  function share(p: any) {
    const isRent = p.purpose === 'Locação';
    const priceLabel = isRent && p.rent ? `${money(p.rent)}/mês` : money(p.price);
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/imoveis/${p.id}`;
    window.open(
      whatsappUrl('5515996897738', templates.propertyShare({
        title: p.title, neighborhood: p.neighborhood || '', city: p.city, state: p.state,
        price: priceLabel, bedrooms: p.bedrooms, bathrooms: p.bathrooms, parking: p.parking,
        area: p.area, description: p.description || '', url,
      })),
      '_blank'
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card-base p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-input pl-10"
            placeholder="Buscar por título, bairro ou código..."
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="field-input w-auto">
          <option>Todos</option>
          <option>Venda</option>
          <option>Locação</option>
          <option>Disponível</option>
          <option>Reservado</option>
          <option>Alugado</option>
          <option>Vendido</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/50 border-b border-border">
                {['Imóvel', 'Tipo / Finalidade', 'Valor', 'Status', 'Portais', 'Ações'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-widest text-ink-soft/70 uppercase font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-ink-soft/60">
                    Nenhum imóvel encontrado
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const photo = p.photos?.[0];
                const isRent = p.purpose === 'Locação';
                const priceLabel = isRent && p.rent ? `${money(p.rent)}/mês` : money(p.price);

                return (
                  <tr key={p.id} className="hover:bg-cream/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream shrink-0 relative">
                          {photo ? (
                            <Image src={photo} alt={p.title} fill className="object-cover" sizes="56px" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-moss/40">
                              <Building2 size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-ink truncate max-w-[260px]">{p.title}</div>
                          <div className="text-xs text-ink-soft/65 flex items-center gap-2">
                            {p.code && <span className="font-mono">#{p.code}</span>}
                            <span>· {p.neighborhood}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-ink">{p.type}</div>
                      <div className="text-xs text-ink-soft/60">{p.purpose}</div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-ink">{priceLabel}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${
                        p.status === 'Disponível' ? 'bg-green/10 text-green' :
                        p.status === 'Reservado' ? 'bg-yellow/10 text-yellow' :
                        p.status === 'Alugado' ? 'bg-moss/10 text-moss' :
                        'bg-blue/10 text-blue'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.portals?.length > 0 ? (
                        <span className="badge bg-cream text-ink-soft border border-border flex items-center gap-1 w-fit">
                          <Globe size={11} /> {p.portals.length}
                        </span>
                      ) : <span className="text-xs text-ink-soft/40">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/imoveis/${p.id}`} target="_blank" className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-ink transition" title="Ver no site">
                          <Eye size={15} />
                        </Link>
                        <button onClick={() => share(p)} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-green transition" title="Compartilhar">
                          <MessageCircle size={15} />
                        </button>
                        <Link href={`/admin/imoveis/${p.id}/editar`} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-terra transition" title="Editar">
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => del(p.id, p.title)} className="p-2 hover:bg-cream rounded-md text-ink-soft hover:text-red transition" title="Excluir">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
