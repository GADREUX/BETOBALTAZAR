import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { money } from '@/lib/utils';
import { Plus, Building2, AlertCircle } from 'lucide-react';
import PropertiesTable from './properties-table';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  const supabase = createClient();
  const { data: properties, count } = await supabase
    .from('properties')
    .select('*, owners(name)', { count: 'exact' })
    .order('created_at', { ascending: false });

  const total = count || 0;
  const remaining = Math.max(0, 50 - total);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-ink-soft">
            <strong className="text-ink font-display text-2xl">{total}</strong>
            <span className="text-ink-soft/60"> / 50 imóveis</span>
          </p>
          <p className="text-xs text-ink-soft/60 mt-0.5">
            {remaining > 0 ? `${remaining} vagas restantes` : 'Limite atingido'}
          </p>
        </div>

        {remaining > 0 ? (
          <Link href="/admin/imoveis/novo" className="btn-primary">
            <Plus size={16} /> Novo Imóvel
          </Link>
        ) : (
          <div className="badge bg-red/10 text-red flex items-center gap-1.5 py-2 px-3">
            <AlertCircle size={14} /> Limite de 50 imóveis atingido
          </div>
        )}
      </div>

      <PropertiesTable properties={properties || []} />
    </div>
  );
}
