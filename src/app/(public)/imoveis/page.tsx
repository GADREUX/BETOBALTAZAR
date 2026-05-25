import { createClient } from '@/lib/supabase/server';
import PropertyListing from './listing';
import type { Property } from '@/types/database';

export const metadata = {
  title: 'Imóveis disponíveis — Beto Baltazar Corretor',
  description: 'Casas, apartamentos e imóveis comerciais para compra e locação em Capão Bonito/SP.',
};

export const revalidate = 60;

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: { purpose?: string; type?: string; q?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from('properties')
    .select('*')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (searchParams.purpose && searchParams.purpose !== 'Todos') {
    query = query.eq('purpose', searchParams.purpose);
  }
  if (searchParams.type && searchParams.type !== 'Todos') {
    query = query.eq('type', searchParams.type);
  }

  const { data: properties } = await query;

  let filtered = (properties || []) as Property[];
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.neighborhood?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      <section className="bg-gradient-to-b from-cream/30 to-paper border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <p className="text-xs tracking-[4px] text-terra uppercase mb-3 font-semibold">
            Nossa carteira
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight max-w-2xl">
            Imóveis disponíveis<br />em Capão Bonito.
          </h1>
        </div>
      </section>

      <PropertyListing properties={filtered} initialParams={searchParams} />
    </div>
  );
}
