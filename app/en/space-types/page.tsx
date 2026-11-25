import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageTypes } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.types, 'en', 'Commercial space types', 'Office, retail, restaurant, industrial, clinic, workshop or mixed use: what to check for each type of space in Montréal.'),
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.types.en}>
      <PageTypes langue="en" />
    </Coquille>
  );
}
