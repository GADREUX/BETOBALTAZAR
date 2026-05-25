import ComingSoon from '@/components/coming-soon';

export default function ProprietariosPage() {
  return (
    <ComingSoon
      title="Proprietários"
      description="Cadastro completo dos proprietários dos imóveis da sua carteira."
      features={[
        'Cadastro completo: CPF, RG, contato e endereço',
        'Vinculação aos imóveis',
        'Histórico de contratos por proprietário',
        'Repasse mensal e prestação de contas',
        'Dados bancários para repasse',
      ]}
    />
  );
}
