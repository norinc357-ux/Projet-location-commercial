import type { T } from './i18n';
import type { Option, TypeLocal } from './types';

export const TYPES_LOCAL: (Option & { valeur: TypeLocal })[] = [
  { valeur: 'bureau', libelle: { fr: 'Bureau', en: 'Office' }, icone: 'Building2', description: { fr: 'Siège social, professionnels, équipe', en: 'Head office, professionals, team' } },
  { valeur: 'commerce', libelle: { fr: 'Commerce de détail', en: 'Retail' }, icone: 'Store', description: { fr: 'Boutique avec vitrine sur rue', en: 'Storefront shop' } },
  { valeur: 'restaurant', libelle: { fr: 'Restaurant ou café', en: 'Restaurant or café' }, icone: 'UtensilsCrossed', description: { fr: 'Cuisine, salle, terrasse', en: 'Kitchen, dining room, patio' } },
  { valeur: 'industriel', libelle: { fr: 'Industriel ou entrepôt', en: 'Industrial or warehouse' }, icone: 'Warehouse', description: { fr: 'Quais, hauteur libre, production', en: 'Docks, clear height, production' } },
  { valeur: 'clinique', libelle: { fr: 'Clinique', en: 'Clinic' }, icone: 'Stethoscope', description: { fr: 'Santé, soins, consultations', en: 'Health care, treatment, consultations' } },
  { valeur: 'atelier', libelle: { fr: 'Atelier', en: 'Workshop' }, icone: 'Hammer', description: { fr: 'Fabrication, métiers, studio', en: 'Making, trades, studio' } },
  { valeur: 'mixte', libelle: { fr: 'Mixte', en: 'Mixed use' }, icone: 'Layers', description: { fr: 'Plusieurs usages dans un même local', en: 'Several uses in one space' } },
];

export const libelleType = (v: string): T => TYPES_LOCAL.find((o) => o.valeur === v)?.libelle ?? { fr: v, en: v };

export type GroupeSecteurs = { groupe: T; secteurs: { code: string; nom: string }[] };

/** Secteurs de départ (hypothèse H3), modifiables par l'agence dans Réglages. */
export const SECTEURS: GroupeSecteurs[] = [
  {
    groupe: { fr: 'Centre', en: 'Downtown and centre' },
    secteurs: [
      { code: 'vieux-montreal', nom: 'Vieux-Montréal' },
      { code: 'centre-ville', nom: 'Centre-ville' },
      { code: 'griffintown', nom: 'Griffintown' },
      { code: 'quartier-latin', nom: 'Quartier latin' },
    ],
  },
  {
    groupe: { fr: 'Est et Nord', en: 'East and North' },
    secteurs: [
      { code: 'plateau-mont-royal', nom: 'Plateau-Mont-Royal' },
      { code: 'mile-end', nom: 'Mile End' },
      { code: 'rosemont-petite-patrie', nom: 'Rosemont–Petite-Patrie' },
      { code: 'villeray', nom: 'Villeray' },
      { code: 'hochelaga', nom: 'Hochelaga' },
      { code: 'anjou', nom: 'Anjou' },
    ],
  },
  {
    groupe: { fr: 'Ouest', en: 'West' },
    secteurs: [
      { code: 'saint-henri', nom: 'Saint-Henri' },
      { code: 'saint-laurent', nom: 'Saint-Laurent' },
      { code: 'lachine', nom: 'Lachine' },
      { code: 'pointe-claire', nom: 'Pointe-Claire' },
    ],
  },
  {
    groupe: { fr: 'Couronnes', en: 'Suburbs' },
    secteurs: [
      { code: 'laval', nom: 'Laval' },
      { code: 'longueuil', nom: 'Longueuil' },
      { code: 'brossard', nom: 'Brossard' },
      { code: 'boisbriand-blainville', nom: 'Boisbriand / Blainville' },
      { code: 'terrebonne', nom: 'Terrebonne' },
      { code: 'vaudreuil', nom: 'Vaudreuil-Dorion' },
    ],
  },
];

export const nomSecteur = (code: string) =>
  SECTEURS.flatMap((g) => g.secteurs).find((s) => s.code === code)?.nom ?? code;

export const FACTEURS_EMPLACEMENT: Option[] = [
  { valeur: 'metro', libelle: { fr: 'Métro à distance de marche', en: 'Metro within walking distance' }, icone: 'Train' },
  { valeur: 'stationnement', libelle: { fr: 'Stationnement', en: 'Parking' }, icone: 'Car' },
  { valeur: 'visibilite', libelle: { fr: 'Visibilité depuis la rue', en: 'Street visibility' }, icone: 'Eye' },
  { valeur: 'achalandage', libelle: { fr: 'Achalandage piéton', en: 'Foot traffic' }, icone: 'Footprints' },
  { valeur: 'camion', libelle: { fr: 'Accès camion', en: 'Truck access' }, icone: 'Truck' },
  { valeur: 'autoroute', libelle: { fr: 'Proximité d’une autoroute', en: 'Highway access' }, icone: 'Route' },
];

/** Critères de l'étape 7. `types` vide = pertinent pour tous les types. */
export const PRIORITES: { code: string; libelle: T; types: string[] }[] = [
  { code: 'climatisation', libelle: { fr: 'Climatisation', en: 'Air conditioning' }, types: [] },
  { code: 'lumiere_naturelle', libelle: { fr: 'Lumière naturelle', en: 'Natural light' }, types: [] },
  { code: 'fibre', libelle: { fr: 'Internet par fibre optique', en: 'Fibre internet' }, types: [] },
  { code: 'securite', libelle: { fr: 'Système de sécurité', en: 'Security system' }, types: [] },
  { code: 'accessibilite', libelle: { fr: 'Accès sans marche', en: 'Step-free access' }, types: [] },
  { code: 'ascenseur', libelle: { fr: 'Ascenseur', en: 'Elevator' }, types: ['bureau', 'clinique', 'mixte'] },
  { code: 'enseigne', libelle: { fr: 'Enseigne extérieure', en: 'Exterior signage' }, types: ['commerce', 'restaurant', 'clinique', 'mixte', 'bureau'] },
  { code: 'terrasse', libelle: { fr: 'Terrasse', en: 'Patio' }, types: ['restaurant', 'commerce', 'mixte'] },
  { code: 'douches', libelle: { fr: 'Douches', en: 'Showers' }, types: ['bureau', 'industriel', 'atelier', 'mixte'] },
  { code: 'velo', libelle: { fr: 'Stationnement pour vélos', en: 'Bike parking' }, types: [] },
  { code: 'stationnement_clients', libelle: { fr: 'Stationnement pour la clientèle', en: 'Customer parking' }, types: ['commerce', 'restaurant', 'clinique', 'mixte'] },
  { code: 'cuisinette', libelle: { fr: 'Cuisinette pour l’équipe', en: 'Staff kitchenette' }, types: ['bureau', 'clinique', 'atelier', 'mixte'] },
  { code: 'acces_24_7', libelle: { fr: 'Accès 24 h sur 24', en: '24/7 access' }, types: ['bureau', 'industriel', 'atelier', 'mixte'] },
  { code: 'entreposage', libelle: { fr: 'Espace d’entreposage', en: 'Storage space' }, types: ['commerce', 'restaurant', 'atelier', 'mixte'] },
];

export const prioritesPour = (types: string[]) =>
  PRIORITES.filter((p) => p.types.length === 0 || types.length === 0 || p.types.some((ty) => types.includes(ty)));

export const DEAL_BREAKERS: Option[] = [
  { valeur: 'sous_sol', libelle: { fr: 'Local au sous-sol', en: 'Basement space' } },
  { valeur: 'sans_fenetre', libelle: { fr: 'Pas de fenêtres', en: 'No windows' } },
  { valeur: 'sans_stationnement', libelle: { fr: 'Aucun stationnement à proximité', en: 'No parking nearby' } },
  { valeur: 'etage_sans_ascenseur', libelle: { fr: 'Étage sans ascenseur', en: 'Upper floor without elevator' } },
  { valeur: 'travaux_majeurs', libelle: { fr: 'Gros travaux nécessaires avant d’ouvrir', en: 'Major work needed before opening' } },
  { valeur: 'bail_plus_5_ans', libelle: { fr: 'Bail de plus de 5 ans exigé', en: 'Lease longer than 5 years required' } },
  { valeur: 'garantie_exigee', libelle: { fr: 'Garantie personnelle exigée', en: 'Personal guarantee required' } },
  { valeur: 'loin_metro', libelle: { fr: 'À plus de 15 min de marche d’un métro', en: 'More than a 15-min walk from a metro' } },
];

export const ETAPES: { numero: number; titre: T }[] = [
  { numero: 1, titre: { fr: 'Vous', en: 'About you' } },
  { numero: 2, titre: { fr: 'Votre projet', en: 'Your project' } },
  { numero: 3, titre: { fr: 'Emplacement', en: 'Location' } },
  { numero: 4, titre: { fr: 'Espace', en: 'Space' } },
  { numero: 5, titre: { fr: 'Besoins techniques', en: 'Technical needs' } },
  { numero: 6, titre: { fr: 'Budget et bail', en: 'Budget and lease' } },
  { numero: 7, titre: { fr: 'Vos priorités', en: 'Your priorities' } },
  { numero: 8, titre: { fr: 'Dans vos mots', en: 'In your own words' } },
  { numero: 9, titre: { fr: 'Récapitulatif', en: 'Summary' } },
];

/**
 * Fourchettes indicatives du coût total (loyer + frais d'exploitation), en $/pi²/an, région de Montréal.
 * HYPOTHÈSE À VALIDER PAR L'AGENCE : à mettre à jour chaque trimestre dans Réglages (étape 5).
 */
export const FOURCHETTES_MARCHE: Record<string, [number, number]> = {
  bureau: [22, 45],
  commerce: [25, 65],
  restaurant: [30, 65],
  industriel: [14, 24],
  clinique: [25, 45],
  atelier: [14, 24],
  mixte: [20, 40],
};

/** Fourchette pour les types choisis : la plus basse des bornes basses, la plus haute des bornes hautes. */
export function fourchettePour(types: string[]): [number, number] | null {
  const f = types.map((t) => FOURCHETTES_MARCHE[t]).filter(Boolean);
  if (!f.length) return null;
  return [Math.min(...f.map((x) => x[0])), Math.max(...f.map((x) => x[1]))];
}

/** Date d'emménagement suggérée à partir de l'échéance choisie à l'étape 2 (en mois). */
export const MOIS_PAR_URGENCE: Record<string, number> = { moins_1_mois: 1, '1_3_mois': 2, '3_6_mois': 4, '6_12_mois': 9 };
