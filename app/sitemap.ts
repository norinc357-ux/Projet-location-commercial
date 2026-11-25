import type { MetadataRoute } from 'next';
import { PAGES, SLUGS_TYPES, lienType } from '@/lib/site/liens';
import { URL_SITE } from '@/lib/site/meta';
import type { TypeLocal } from '@/lib/formulaire/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const paires = [
    ...(['accueil', 'commentCaMarche', 'types', 'guide', 'aPropos', 'contact', 'confidentialite', 'formulaire'] as const).map((k) => PAGES[k]),
    ...(Object.keys(SLUGS_TYPES) as TypeLocal[]).map((t) => ({ fr: lienType(t, 'fr'), en: lienType(t, 'en') })),
  ];
  return paires.flatMap((p) =>
    (['fr', 'en'] as const).map((l) => ({
      url: `${URL_SITE}${p[l]}`,
      alternates: { languages: { 'fr-CA': `${URL_SITE}${p.fr}`, 'en-CA': `${URL_SITE}${p.en}` } },
    })),
  );
}
