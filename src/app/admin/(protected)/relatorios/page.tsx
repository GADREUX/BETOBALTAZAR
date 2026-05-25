import ComingSoon from '@/components/coming-soon';

export default function RelatoriosPage() {
  return (
    <ComingSoon
      title="Relatórios"
      description="Gráficos e indicadores para você acompanhar a performance do seu negócio."
      features={[
        'Distribuição da carteira por tipo de imóvel',
        'Leads por fonte (Site, WhatsApp, Indicação)',
        'Taxa de conversão mensal',
        'Receita por proprietário e por imóvel',
        'Performance dos anúncios em cada portal',
        'Exportação em PDF e Excel',
      ]}
    />
  );
}
