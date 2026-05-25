import { createClient } from '@/lib/supabase/server';
import SubmissionsList from './submissions-list';

export const dynamic = 'force-dynamic';

export default async function SubmissionsPage() {
  const supabase = createClient();
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest text-terra uppercase font-semibold mb-1">
          Inbox
        </p>
        <h2 className="font-display text-2xl font-bold text-ink">
          Solicitações recebidas pelo site
        </h2>
        <p className="text-sm text-ink-soft/70 mt-1">
          Pessoas que preencheram o formulário de cadastro de imóvel ou contato.
        </p>
      </div>

      <SubmissionsList initial={submissions || []} />
    </div>
  );
}
