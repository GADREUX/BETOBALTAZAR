import ComingSoon from '@/components/coming-soon';

export default function CrmPage() {
  return (
    <ComingSoon
      title="CRM e Funil de Vendas"
      description="Kanban completo dos seus leads, do primeiro contato ao fechamento."
      features={[
        'Visualização em Kanban (arrastar e soltar entre estágios)',
        'Visualização em lista com filtros avançados',
        'Cadastro de leads com fonte (Site, WhatsApp, Indicação)',
        'Vinculação de leads a imóveis específicos',
        'Histórico de interações por lead',
        'Lembretes de follow-up',
      ]}
    />
  );
}
