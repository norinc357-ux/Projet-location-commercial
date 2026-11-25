import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageConfidentialite } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.confidentialite, 'fr', 'Politique de confidentialité', 'Comment nous protégeons vos renseignements personnels, conformément à la Loi 25.'),
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.confidentialite.fr}>
      <PageConfidentialite langue="fr" />
    </Coquille>
  );
}
