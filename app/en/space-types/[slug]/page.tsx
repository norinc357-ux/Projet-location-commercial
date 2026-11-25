import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Coquille } from '@/components/site/Coquille';
import { PageTypeLocal } from '@/components/site/Pages';
import { meta } from '@/lib/site/meta';
import { SLUGS_TYPES, lienType, typeDepuisSlug } from '@/lib/site/liens';
import { CONTENU_TYPES } from '@/lib/site/typesLocaux';
import type { TypeLocal } from '@/lib/formulaire/types';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.values(SLUGS_TYPES).map((s) => ({ slug: s.en }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type = typeDepuisSlug((await params).slug, 'en') as TypeLocal;
  const c = CONTENU_TYPES[type];
  return meta({ fr: lienType(type, 'fr'), en: lienType(type, 'en') }, 'en', c.titre.en, c.metaDescription.en);
}

export default async function Page({ params }: Props) {
  const type = typeDepuisSlug((await params).slug, 'en');
  if (!type) notFound();
  return (
    <Coquille langue="en" chemin={lienType(type, 'en')}>
      <PageTypeLocal langue="en" type={type} />
    </Coquille>
  );
}
