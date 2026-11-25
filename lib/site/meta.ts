import type { Metadata } from 'next';
import { AGENCE } from '@/lib/config';
import type { Langue } from '@/lib/formulaire/i18n';

export const URL_SITE = process.env.SITE_URL ?? 'https://exemple.ca';

/** Métadonnées d'une page publique : titre, description, versions FR/EN (hreflang), Open Graph. */
export function meta(chemins: { fr: string; en: string }, langue: Langue, titre: string, description: string): Metadata {
  const complet = `${titre} | ${AGENCE.nom}`;
  return {
    metadataBase: new URL(URL_SITE),
    title: complet,
    description,
    alternates: { canonical: chemins[langue], languages: { 'fr-CA': chemins.fr, 'en-CA': chemins.en, 'x-default': chemins.fr } },
    openGraph: { title: complet, description, url: chemins[langue], siteName: AGENCE.nom, locale: langue === 'fr' ? 'fr_CA' : 'en_CA', type: 'website' },
  };
}
