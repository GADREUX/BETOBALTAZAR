import ComingSoon from '@/components/coming-soon';

export default function PortaisPage() {
  return (
    <ComingSoon
      title="Integração com Portais"
      description="Status de publicação dos seus imóveis em ZAP Imóveis, OLX, Viva Real e outros."
      features={[
        'Marcação manual de imóveis publicados em cada portal',
        'Link direto para o anúncio em cada portal',
        'Histórico de quando foi publicado',
        'Alertas de anúncios pausados ou removidos',
        'Geração de descrição padronizada para copiar nos portais',
      ]}
    />
  );
}
