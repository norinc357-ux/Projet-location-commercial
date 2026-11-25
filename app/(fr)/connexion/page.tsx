import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageConnexion } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.connexion, 'fr', 'Espace client', 'Accédez à votre espace client pour suivre votre dossier.'),
  robots: { index: false },
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.connexion.fr}>
      <PageConnexion langue="fr" />
    </Coquille>
  );
}
