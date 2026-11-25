import type { Metadata } from 'next';
import { Coquille } from '@/components/site/Coquille';
import { PageCommentCaMarche } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { PAGES } from '@/lib/site/liens';

export const metadata: Metadata = {
  ...meta(PAGES.commentCaMarche, 'fr', 'Comment ça marche', 'Le parcours complet, de votre demande à la remise des clés : qui fait quoi et en combien de temps.'),
};

export default function Page() {
  return (
    <Coquille langue="fr" chemin={PAGES.commentCaMarche.fr}>
      <PageCommentCaMarche langue="fr" />
    </Coquille>
  );
}
