import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beto Baltazar Corretor — Imóveis em Capão Bonito/SP',
  description:
    'Beto Baltazar — Corretor de Imóveis em Capão Bonito/SP. CRECI 318284-F. Compra, venda e locação de imóveis com transparência, segurança e cuidado em cada negociação.',
  keywords: ['imóveis Capão Bonito', 'corretor Capão Bonito', 'casa à venda Capão Bonito', 'aluguel Capão Bonito', 'Beto Baltazar'],
  authors: [{ name: 'Beto Baltazar' }],
  openGraph: {
    title: 'Beto Baltazar Corretor — Imóveis em Capão Bonito/SP',
    description: 'Compra, venda e locação de imóveis em Capão Bonito com transparência e cuidado.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0E1A14',
              color: '#F5F1E8',
              border: '1px solid #2A3A32',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
          }}
        />
      </body>
    </html>
  );
}
