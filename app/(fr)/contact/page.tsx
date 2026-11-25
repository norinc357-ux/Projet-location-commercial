import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageContact } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.contact, 'fr', 'Contact', 'Une question sur votre projet de local commercial ? Écrivez-nous ou appelez-nous.'),
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.contact.fr}>
      <PageContact langue="fr" />
    </Coquille>
  );
}
