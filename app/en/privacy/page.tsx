import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageConfidentialite } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.confidentialite, 'en', 'Privacy policy', 'How we protect your personal information, in line with Québec’s Law 25.'),
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.confidentialite.en}>
      <PageConfidentialite langue="en" />
    </Coquille>
  );
}
