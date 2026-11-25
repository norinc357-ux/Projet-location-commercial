import type { Langue } from '@/lib/formulaire/i18n';
import type { TypeLocal } from '@/lib/formulaire/types';

/** Toutes les adresses du site public, en français et en anglais (une seule source). */
export const PAGES = {
  accueil: { fr: '/', en: '/en' },
  commentCaMarche: { fr: '/comment-ca-marche', en: '/en/how-it-works' },
  types: { fr: '/types-de-locaux', en: '/en/space-types' },
  guide: { fr: '/guide-du-locataire', en: '/en/tenant-guide' },
  aPropos: { fr: '/a-propos', en: '/en/about' },
  contact: { fr: '/contact', en: '/en/contact' },
  confidentialite: { fr: '/confidentialite', en: '/en/privacy' },
  formulaire: { fr: '/decrire-mon-projet', en: '/en/describe-my-project' },
  connexion: { fr: '/connexion', en: '/en/login' },
} as const;
export type CleePage = keyof typeof PAGES;

export const SLUGS_TYPES: Record<TypeLocal, { fr: string; en: string }> = {
  bureau: { fr: 'bureau', en: 'office' },
  commerce: { fr: 'commerce-de-detail', en: 'retail' },
  restaurant: { fr: 'restaurant-cafe', en: 'restaurant-cafe' },
  industriel: { fr: 'industriel-entrepot', en: 'industrial-warehouse' },
  clinique: { fr: 'clinique', en: 'clinic' },
  atelier: { fr: 'atelier', en: 'workshop' },
  mixte: { fr: 'mixte', en: 'mixed-use' },
};

export const lien = (page: CleePage, l: Langue) => PAGES[page][l];
export const lienType = (type: TypeLocal, l: Langue) => `${PAGES.types[l]}/${SLUGS_TYPES[type][l]}`;
export const typeDepuisSlug = (slug: string, l: Langue) =>
  (Object.keys(SLUGS_TYPES) as TypeLocal[]).find((k) => SLUGS_TYPES[k][l] === slug) ?? null;

/** Adresse équivalente dans l'autre langue, pour le sélecteur FR/EN. */
export function autreLangue(chemin: string, l: Langue): string {
  const autre: Langue = l === 'fr' ? 'en' : 'fr';
  for (const k of Object.keys(PAGES) as CleePage[]) if (PAGES[k][l] === chemin) return PAGES[k][autre];
  const prefixe = `${PAGES.types[l]}/`;
  if (chemin.startsWith(prefixe)) {
    const t = typeDepuisSlug(chemin.slice(prefixe.length), l);
    if (t) return lienType(t, autre);
  }
  return PAGES.accueil[autre];
}
