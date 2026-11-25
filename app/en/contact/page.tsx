import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageContact } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.contact, 'en', 'Contact', 'A question about your commercial space project? Write or call us.'),
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.contact.en}>
      <PageContact langue="en" />
    </Coquille>
  );
}
