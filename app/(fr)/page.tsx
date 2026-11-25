import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageAccueil } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';
import { JsonLdAgence } from '@/components/site/JsonLd';

export const metadata: Metadata = {
  ...meta(PAGES.accueil, 'fr', 'Location de locaux commerciaux à Montréal, clé en main', 'Bureau, boutique, restaurant, entrepôt ou clinique : décrivez votre projet une fois. On cherche, on visite, on négocie et on s’occupe du bail.'),
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.accueil.fr}>
      <JsonLdAgence langue="fr" />
      <PageAccueil langue="fr" />
    </Coquille>
  );
}
