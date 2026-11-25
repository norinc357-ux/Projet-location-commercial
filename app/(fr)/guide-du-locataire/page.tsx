import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageGuide } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.guide, 'fr', 'Guide du locataire commercial', 'Bail brut, net ou triple net, frais d’exploitation, dépôt, améliorations locatives, clauses à surveiller et lexique.'),
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.guide.fr}>
      <PageGuide langue="fr" />
    </Coquille>
  );
}
