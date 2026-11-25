import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageAPropos } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.aPropos, 'en', 'About us', 'A commercial leasing agency built for tenants, in and around Montréal.'),
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.aPropos.en}>
      <PageAPropos langue="en" />
    </Coquille>
  );
}
