import ComingSoon from '@/components/coming-soon';

export default function VistoriasPage() {
  return (
    <ComingSoon
      title="Laudos de Vistoria"
      description="Vistorias de entrada e saída com fotos e condições documentadas."
      features={[
        'Wizard guiado por cômodos (sala, quartos, cozinha, banheiros)',
        'Avaliação de condição por item (Ótimo, Bom, Regular, Ruim)',
        'Upload de fotos por cômodo',
        'Geração de laudo em PDF',
        'Comparação entre vistoria de entrada e saída',
        'Assinatura digital opcional',
      ]}
    />
  );
}
