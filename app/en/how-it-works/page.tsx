import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageCommentCaMarche } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.commentCaMarche, 'en', 'How it works', 'The full process, from your request to the keys: who does what and how long it takes.'),
};

export default function Page() {
  return (
    <Coquille langue="en" chemin={PAGES.commentCaMarche.en}>
      <PageCommentCaMarche langue="en" />
    </Coquille>
  );
}
