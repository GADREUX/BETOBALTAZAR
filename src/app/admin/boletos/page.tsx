import ComingSoon from '@/components/coming-soon';

export default function BoletosPage() {
  return (
    <ComingSoon
      title="Boletos PIX"
      description="Geração automática de boletos via PIX com QR Code e cobrança no WhatsApp."
      features={[
        'Geração automática de PIX para cada contrato ativo',
        'QR Code para pagamento direto',
        'Botão "Lembrar via WhatsApp" com mensagem pronta',
        'Marcação de pagamento com data de quitação',
        'Aviso automático para boletos vencidos',
        'Histórico financeiro por inquilino',
      ]}
    />
  );
}
