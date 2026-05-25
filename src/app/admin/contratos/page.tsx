import ComingSoon from '@/components/coming-soon';

export default function ContratosPage() {
  return (
    <ComingSoon
      title="Contratos de Locação"
      description="Geração e gestão de contratos de aluguel com cláusulas customizáveis."
      features={[
        'Modelo de contrato pronto (locação residencial e comercial)',
        'Preenchimento automático com dados do imóvel/proprietário/inquilino',
        'Geração de PDF para impressão e assinatura',
        'Reajuste anual configurável (IGPM, IPCA, etc)',
        'Alertas de renovação 30 dias antes do vencimento',
      ]}
    />
  );
}
