import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageAPropos } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.aPropos, 'fr', 'À propos', 'Une agence de location commerciale pensée pour les locataires, à Montréal et dans les environs.'),
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.aPropos.fr}>
      <PageAPropos langue="fr" />
    </Coquille>
  );
}
