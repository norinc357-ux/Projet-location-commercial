import type { Metadata, Viewport } from 'next';
import '@/components/formulaire/formulaire.css';

export const metadata: Metadata = {
  title: 'Clé en main Commercial (nom provisoire)',
  description: 'Location de locaux commerciaux à Montréal, clé en main.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0e1e3a' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
