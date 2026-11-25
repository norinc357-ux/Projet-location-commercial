import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageTypes } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.types, 'fr', 'Types de locaux commerciaux', 'Bureau, commerce, restaurant, industriel, clinique, atelier ou mixte : les points à vérifier pour chaque type de local à Montréal.'),
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.types.fr}>
      <PageTypes langue="fr" />
    </Coquille>
  );
}
