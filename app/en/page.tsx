import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageAccueil } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';
import { JsonLdAgence } from '@/components/site/JsonLd';

export const metadata: Metadata = {
  ...meta(PAGES.accueil, 'en', 'Turnkey commercial space leasing in Montréal', 'Office, shop, restaurant, warehouse or clinic: describe your project once. We search, tour, negotiate and handle the lease.'),
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.accueil.en}>
      <JsonLdAgence langue="en" />
      <PageAccueil langue="en" />
    </Coquille>
  );
}
