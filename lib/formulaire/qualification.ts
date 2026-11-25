/**
 * Score de qualification (0 à 100) : aide l'agent à savoir qui appeler en premier.
 * Jamais montré au client. Pondérations du document d'étape 1, modifiables dans Réglages (étape 5).
 */
import type { Reponses, Superficie } from './types';
import { positionBudget } from './calculs';
import { versCriteres } from './criteres';

export type Drapeau =
  | 'budget_sous_marche'
  | 'financement_pas_encore'
  | 'autre_courtier'
  | 'decision_en_equipe'
  | 'fin_bail_proche'
  | 'beaucoup_de_visites'
  | 'points_a_valider';

export type Qualification = {
  score: number;
  niveau: 'chaud' | 'tiede' | 'froid';
  detail: { budget: number; urgence: number; completude: number; solidite: number; valeur: number };
  drapeaux: Drapeau[];
};

const URGENCE: Record<string, number> = { moins_1_mois: 25, '1_3_mois': 22, '3_6_mois': 18, '6_12_mois': 10, exploration: 3 };
const DUREE_ANS: Record<string, number> = { '1_2': 1.5, '3': 3, '5': 5, '10_plus': 10 };

const joursAvant = (iso: unknown) => (typeof iso === 'string' && iso ? (Date.parse(iso) - Date.now()) / 864e5 : null);

export function qualifier(r: Reponses): Qualification {
  const drapeaux: Drapeau[] = [];

  // Budget réaliste (35)
  const pos = positionBudget(r);
  const budget = !pos ? 15 : pos.position === 'sous' ? (pos.pi2 >= pos.fourchette[0] * 0.75 ? 15 : 5) : 35;
  if (pos?.position === 'sous') drapeaux.push('budget_sous_marche');

  // Urgence (25)
  let urgence = URGENCE[String(r['projet.urgence'])] ?? 8;
  const fin = joursAvant(r['actuel.finBail']);
  if (fin !== null && fin > 0 && fin < 270) {
    urgence = Math.min(25, urgence + 5);
    drapeaux.push('fin_bail_proche');
  }

  // Dossier complet (20) : champs utiles remplis + appel réservé
  const utiles = ['entreprise.neq', 'espace.employes3ans', 'espace.configuration', 'mots.description', 'actuel.superficie', 'emplacement.adresses', 'projet.visites'];
  const remplis = utiles.filter((k) => {
    const v = r[k];
    return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
  }).length;
  const rdv = r['rdv.creneau'];
  const completude = Math.round((remplis / utiles.length) * 15) + (rdv && rdv !== 'plus_tard' ? 5 : 0);

  // Solidité (10)
  let solidite = 0;
  if (r['entreprise.statut'] === 'existante') solidite += 4;
  if (r['entreprise.neq']) solidite += 2;
  const fin_ = r['projet.financement'];
  if (fin_ === 'en_place') solidite += 2;
  if (fin_ === 'pas_encore') drapeaux.push('financement_pas_encore');
  if (['oui', 'a_discuter'].includes(String(r['budget.garantie'])) || ['oui', 'a_discuter'].includes(String(r['budget.depot']))) solidite += 2;
  solidite = Math.min(10, solidite);

  // Valeur du mandat (10) : superficie × durée, proxy de la commission
  const sup = r['espace.superficie'] as Superficie | undefined;
  const pi2 = sup ? (sup.min && sup.max ? (sup.min + sup.max) / 2 : sup.min || sup.max || 0) : 0;
  const anneesPi2 = pi2 * (DUREE_ANS[String(r['bail.duree'])] ?? 3);
  const valeur = anneesPi2 >= 50000 ? 10 : anneesPi2 >= 15000 ? 7 : anneesPi2 >= 5000 ? 4 : 2;

  if (r['projet.autreCourtier'] === 'oui') drapeaux.push('autre_courtier');
  if (['associes', 'direction'].includes(String(r['projet.decideur']))) drapeaux.push('decision_en_equipe');
  if (r['projet.visites'] === 'beaucoup') drapeaux.push('beaucoup_de_visites');
  if (versCriteres(r).aValider.length >= 3) drapeaux.push('points_a_valider');

  const score = Math.max(0, Math.min(100, budget + urgence + completude + solidite + valeur));
  return {
    score,
    niveau: score >= 70 ? 'chaud' : score >= 40 ? 'tiede' : 'froid',
    detail: { budget, urgence, completude, solidite, valeur },
    drapeaux,
  };
}
