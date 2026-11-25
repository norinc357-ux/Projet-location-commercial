import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageConnexion } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.connexion, 'en', 'Client portal', 'Sign in to your client portal to follow your file.'),
  robots: { index: false },
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.connexion.en}>
      <PageConnexion langue="en" />
    </Coquille>
  );
}
