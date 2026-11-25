import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageGuide } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.guide, 'en', 'Commercial tenant guide', 'Gross, net or triple net leases, operating costs, deposits, tenant improvements, clauses to watch and glossary.'),
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.guide.en}>
      <PageGuide langue="en" />
    </Coquille>
  );
}
