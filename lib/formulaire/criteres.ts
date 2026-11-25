/**
 * Transforme les réponses du formulaire en critères de jumelage (table `critere` du modèle de données).
 * Même vocabulaire que les caractéristiques des locaux (`caracteristique_local`).
 */
import { AIDE, type Loyer, type Niveau, type Reponses, type Superficie } from './types';
import { champsTous, champVisible } from './ecrans';
import { loyerComplet } from './calculs';

export type Operateur = 'min' | 'max' | 'entre' | 'egal' | 'inclut' | 'exclut';
export type Critere = {
  code: string;
  operateur: Operateur;
  valeur: unknown;
  importance: Niveau;
  /** 1 à 5 */
  poids: number;
  provenance: 'formulaire';
};

const c = (code: string, operateur: Operateur, valeur: unknown, importance: Niveau, poids: number): Critere => ({
  code, operateur, valeur, importance, poids, provenance: 'formulaire',
});

/** essentiel / souhaitable / non → niveau */
const niveau3 = (v: unknown): Niveau | null => (v === 'essentiel' ? 'obligatoire' : v === 'souhaitable' ? 'souhaitable' : null);

/** Questions techniques « oui » = caractéristique obligatoire. */
const OUI_OBLIGATOIRE: Record<string, string> = {
  'restaurant.hotte': 'hotte',
  'restaurant.gaz': 'entree_gaz',
  'restaurant.alcool': 'zonage_permis_alcool',
  'bureau.reception': 'reception',
  'bureau.acces247': 'acces_24_7',
};
/** Questions « essentiel / souhaitable / non ». */
const NIVEAU3: Record<string, string> = {
  'restaurant.terrasse': 'terrasse',
  'commerce.enseigne': 'enseigne',
  'commerce.entrepot': 'entreposage',
  'clinique.insonorisation': 'insonorisation',
  'clinique.accessibilite': 'accessibilite',
  'clinique.stationnement': 'stationnement_clients',
};
/** Nombres minimaux : [code, importance, poids]. */
const MINIMUMS: Record<string, [string, Niveau, number]> = {
  'restaurant.places': ['places_assises', 'souhaitable', 4],
  'commerce.vitrine': ['largeur_vitrine_pi', 'souhaitable', 4],
  'bureau.salles': ['salles_reunion', 'souhaitable', 3],
  'industriel.hauteurLibre': ['hauteur_libre_pi', 'obligatoire', 5],
  'industriel.quais': ['quais', 'obligatoire', 5],
  'industriel.portesSol': ['portes_sol', 'obligatoire', 4],
  'industriel.amperage': ['amperage', 'obligatoire', 5],
  'industriel.bureaux': ['espace_bureau_pi2', 'souhaitable', 3],
  'clinique.sallesPlomberie': ['salles_plomberie', 'obligatoire', 5],
};

export type ResultatCriteres = { criteres: Critere[]; aValider: string[] };

export function versCriteres(r: Reponses): ResultatCriteres {
  const out: Critere[] = [];
  const aValider = champsTous()
    .filter((ch) => champVisible(ch, r) && (r[ch.id] === AIDE || (Array.isArray(r[ch.id]) && (r[ch.id] as unknown[]).includes(AIDE))))
    .map((ch) => ch.id);
  const val = (id: string) => (r[id] === AIDE ? undefined : r[id]);

  // Projet
  const ts = (val('projet.types') as string[] | undefined) ?? [];
  if (ts.length) out.push(c('type_local', 'inclut', ts, 'obligatoire', 5));

  // Emplacement
  const secteurs = ((r['emplacement.secteurs'] as string[] | undefined) ?? []).filter((s) => s !== AIDE);
  if (secteurs.length) out.push(c('secteur', 'inclut', secteurs, 'obligatoire', 5));
  const zone = r['emplacement.zone'] as [number, number][] | undefined;
  if (zone && zone.length >= 3) out.push(c('zone', 'inclut', zone, 'souhaitable', 4));
  const imp = (r['emplacement.importance'] ?? {}) as Record<string, number>;
  for (const [code, note] of Object.entries(imp)) {
    if (note >= 2) out.push(c(code, 'egal', true, note === 5 ? 'obligatoire' : 'souhaitable', note));
  }

  // Espace
  const sup = r['espace.superficie'] as Superficie | undefined;
  if (sup && (sup.min || sup.max)) out.push(c('superficie_pi2', 'entre', { min: sup.min, max: sup.max }, 'obligatoire', 5));
  if (val('espace.etage') === 'rdc_obligatoire') out.push(c('rez_de_chaussee', 'egal', true, 'obligatoire', 5));

  // Techniques
  for (const [id, code] of Object.entries(OUI_OBLIGATOIRE)) if (val(id) === 'oui') out.push(c(code, 'egal', true, 'obligatoire', 5));
  for (const [id, code] of Object.entries(NIVEAU3)) {
    const n = niveau3(val(id));
    if (n) out.push(c(code, 'egal', true, n, n === 'obligatoire' ? 5 : 3));
  }
  for (const [id, [code, n, poids]] of Object.entries(MINIMUMS)) {
    const v = val(id);
    if (typeof v === 'number' && v > 0) out.push(c(code, 'min', v, n, poids));
  }
  if (val('restaurant.equipe') === 'equipe') out.push(c('ancien_restaurant', 'egal', true, 'souhaitable', 4));
  if (val('commerce.achalandage') === 'eleve') out.push(c('achalandage', 'egal', 'eleve', 'souhaitable', 5));
  if (val('bureau.meuble') === 'oui') out.push(c('meuble', 'egal', true, 'souhaitable', 3));
  if (val('industriel.plancher') === 'elevee') out.push(c('plancher_charge_elevee', 'egal', true, 'obligatoire', 5));
  if (val('industriel.electricite') === '600v' || val('atelier.electricite') === '600v') out.push(c('electricite_600v', 'egal', true, 'obligatoire', 5));
  if (val('atelier.electricite') === '220v') out.push(c('electricite_220v', 'egal', true, 'obligatoire', 4));
  const usages = (val('industriel.usage') as string[] | undefined) ?? [];
  if (usages.length) out.push(c('zonage_usage', 'inclut', usages, 'obligatoire', 5));
  if (val('atelier.ventilation') === 'forte') out.push(c('ventilation_forte', 'egal', true, 'obligatoire', 4));
  const camion = val('atelier.camion');
  if (camion && camion !== 'non') out.push(c('acces_camion', 'min', camion, 'obligatoire', 4));
  if (val('atelier.bruit') === 'eleve') out.push(c('usage_bruyant_permis', 'egal', true, 'obligatoire', 4));

  // Précisions par profil (ajoutées pour mieux cibler la recherche)
  if (val('restaurant.concept') === 'bar') out.push(c('zonage_bar', 'egal', true, 'obligatoire', 5));
  if (val('restaurant.concept') === 'production') out.push(c('zonage_production_alimentaire', 'egal', true, 'obligatoire', 5));
  const empl = val('commerce.emplacement');
  if (empl && empl !== 'peu_importe') out.push(c('type_emplacement', 'egal', empl, 'obligatoire', 4));
  const classe = val('bureau.classe');
  if (classe) out.push(c('classe_immeuble', 'egal', classe, 'souhaitable', 3));
  for (const cour of (val('industriel.cour') as string[] | undefined) ?? []) out.push(c(`cour_${cour}`, 'egal', true, 'obligatoire', 4));
  const temp = val('industriel.temperature');
  if (temp === 'controlee' || temp === 'froid') out.push(c(`temperature_${temp}`, 'egal', true, 'obligatoire', 5));
  if (val('industriel.matieres') === 'oui') out.push(c('zonage_matieres_dangereuses', 'egal', true, 'obligatoire', 5));
  const salles = val('clinique.salles');
  if (typeof salles === 'number' && salles > 0) out.push(c('salles_fermees', 'min', salles, 'obligatoire', 5));
  if (val('clinique.imagerie') === 'oui') out.push(c('blindage_radiologie', 'egal', true, 'souhaitable', 4));
  if (val('atelier.activite') === 'mecanique') out.push(c('zonage_garage', 'egal', true, 'obligatoire', 5));
  if (val('atelier.activite') === 'alimentaire') out.push(c('zonage_production_alimentaire', 'egal', true, 'obligatoire', 5));

  // Budget et bail
  const loyer = loyerComplet(r['budget.loyer'] as Loyer | undefined, sup);
  if (loyer?.mensuel) out.push(c('cout_total_mensuel', 'max', loyer.mensuel, 'obligatoire', 5));
  const typeBail = val('bail.type');
  if (typeBail) out.push(c('type_bail', 'egal', typeBail, 'souhaitable', 2));
  const duree = val('bail.duree');
  if (duree) out.push(c('duree_bail', 'egal', duree, 'souhaitable', 2));
  const dateMax = (r['bail.dateLimite'] || r['bail.dateIdeale']) as string | undefined;
  if (dateMax) out.push(c('disponible_le', 'max', dateMax, r['bail.dateLimite'] ? 'obligatoire' : 'souhaitable', 5));

  // Priorités et éliminatoires
  const prio = (r['priorites.criteres'] ?? {}) as Record<string, Niveau>;
  for (const [code, n] of Object.entries(prio)) {
    if (n === 'obligatoire' || n === 'souhaitable') out.push(c(code, 'egal', true, n, n === 'obligatoire' ? 5 : 3));
  }
  for (const e of (r['priorites.eliminatoires'] as string[] | undefined) ?? []) out.push(c(e, 'exclut', true, 'obligatoire', 5));

  // Un même code peut venir de deux questions (ex. accessibilité) : on garde la plus exigeante.
  const parCode = new Map<string, Critere>();
  for (const cr of out) {
    const deja = parCode.get(cr.code);
    if (!deja || (cr.importance === 'obligatoire' && deja.importance !== 'obligatoire') || cr.poids > deja.poids) parCode.set(cr.code, cr);
  }
  return { criteres: [...parCode.values()], aValider };
}
