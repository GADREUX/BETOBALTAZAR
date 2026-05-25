import ComingSoon from '@/components/coming-soon';

export default function InquilinosPage() {
  return (
    <ComingSoon
      title="Inquilinos"
      description="Cadastro completo dos inquilinos atuais e do histórico."
      features={[
        'Cadastro com documentos e referências',
        'Contato de emergência',
        'Histórico de pagamentos',
        'Contrato vigente vinculado',
        'Comunicação direta via WhatsApp',
      ]}
    />
  );
}
