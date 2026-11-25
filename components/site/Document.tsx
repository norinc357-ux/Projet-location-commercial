import type { Langue } from '@/lib/formulaire/i18n';
import '@/components/formulaire/formulaire.css';
import './site.css';

/** Squelette HTML commun aux deux langues (chaque langue a sa propre racine pour un attribut lang correct). */
export function Document({ langue, children }: { langue: Langue; children: React.ReactNode }) {
  return (
    <html lang={langue === 'fr' ? 'fr-CA' : 'en-CA'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
