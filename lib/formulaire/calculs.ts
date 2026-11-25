import type { Langue, T } from './i18n';
import { formatNombre, tf } from './i18n';
import { AIDE, type Champ, type Ecran, type Loyer, type Reponses, type Superficie } from './types';
import { champVisible, ecransVisibles, types } from './ecrans';
import { fourchettePour } from './referentiels';

// ---------------------------------------------------------------------------
// Conversions loyer
// ---------------------------------------------------------------------------

/** Superficie de référence pour convertir un loyer : milieu de la fourchette, sinon la borne connue. */
export function superficieReference(s: Superficie | undefined | null): number | null {
  if (!s) return null;
  const { min, max } = s;
  if (min && max) return Math.round((min + max) / 2);
  return min || max || null;
}

/** Loyer mensuel total → $/pi²/an. */
export const mensuelVersPi2 = (mensuel: number, pi2: number) => Math.round(((mensuel * 12) / pi2) * 100) / 100;
/** $/pi²/an → loyer mensuel total. */
export const pi2VersMensuel = (prixPi2An: number, pi2: number) => Math.round((prixPi2An * pi2) / 12);

/** Complète la valeur manquante (mensuel ou $/pi²) à partir de la superficie. */
export function loyerComplet(loyer: Loyer | undefined, sup: Superficie | undefined): Loyer | null {
  if (!loyer) return null;
  const ref = superficieReference(sup);
  if (!ref) return loyer;
  if (loyer.mode === 'mensuel' && loyer.mensuel) return { ...loyer, pi2: mensuelVersPi2(loyer.mensuel, ref) };
  if (loyer.mode === 'pi2' && loyer.pi2) return { ...loyer, mensuel: pi2VersMensuel(loyer.pi2, ref) };
  return loyer;
}

// ---------------------------------------------------------------------------
// « Aidez-moi à estimer » la superficie
// ---------------------------------------------------------------------------

/** pi² par personne, fourchette usuelle à Montréal (hypothèse à valider par l'agence). */
export const PI2_PAR_PERSONNE: Record<string, [number, number]> = {
  bureau: [150, 200],
  clinique: [250, 350],
  commerce: [250, 400],
  restaurant: [150, 250], // compte la salle et la cuisine ; affiné avec le nombre de places pendant l'appel
  mixte: [200, 300],
  atelier: [400, 600],
  industriel: [800, 1500],
};

const arrondir50 = (n: number) => Math.round(n / 50) * 50;

export type Estimation = { min: number; max: number; personnes: number; ratio: [number, number]; type: string; hybride: boolean; actuel: number | null };

/** Part des postes à prévoir selon la présence au bureau (postes partagés). */
const FACTEUR_HYBRIDE: Record<string, number> = { '5': 1, '3_4': 0.85, '1_2': 0.65, variable: 0.8 };

export function estimerSuperficie(r: Reponses): Estimation | null {
  const emp = Number(r['espace.employes']) || 0;
  const emp3 = Number(r['espace.employes3ans']) || 0;
  const personnes = Math.max(emp, emp3);
  if (personnes <= 0) return null;
  const ts = types(r).filter((ty) => PI2_PAR_PERSONNE[ty]);
  const type = ts.length ? ts.reduce((a, b) => (PI2_PAR_PERSONNE[b][1] > PI2_PAR_PERSONNE[a][1] ? b : a)) : 'bureau';
  const ratio = PI2_PAR_PERSONNE[type];
  const facteur = type === 'bureau' ? FACTEUR_HYBRIDE[String(r['espace.joursBureau'])] ?? 1 : 1;
  const actuel = Number(r['actuel.superficie']) || null;
  let min = Math.max(300, arrondir50(personnes * facteur * ratio[0]));
  let max = Math.max(400, arrondir50(personnes * facteur * ratio[1]));
  // On s'agrandit : jamais plus petit que le local actuel.
  if (actuel && r['projet.raison'] === 'agrandissement' && min <= actuel) {
    min = arrondir50(actuel * 1.1);
    max = Math.max(max, arrondir50(actuel * 1.5));
  }
  return { min, max, personnes, ratio, type, hybride: facteur < 1, actuel };
}

// ---------------------------------------------------------------------------
// Validation (partagée client / serveur)
// ---------------------------------------------------------------------------

export const estVide = (v: unknown): boolean => {
  if (v === undefined || v === null || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'string') return v.trim() === '';
  return false;
};

const MSG = {
  requisChoix: { fr: 'Choisissez une option pour continuer.', en: 'Please choose an option to continue.' },
  requisTexte: { fr: 'Il nous faut cette information pour continuer.', en: 'We need this information to continue.' },
  requisNombre: { fr: 'Indiquez un nombre, même approximatif.', en: 'Enter a number, even a rough one.' },
  requisSecteurs: { fr: 'Choisissez au moins un secteur, ou « Conseillez-moi ».', en: 'Choose at least one area, or “Advise me”.' },
  courriel: { fr: 'Ce courriel semble incomplet. Exemple : nom@entreprise.com', en: 'This email looks incomplete. Example: name@company.com' },
  telephone: { fr: 'Entrez un numéro à 10 chiffres. Exemple : 514 555-0123', en: 'Enter a 10-digit number. Example: 514-555-0123' },
  neq: { fr: 'Le NEQ compte 10 chiffres. Laissez vide si vous ne l’avez pas.', en: 'The NEQ has 10 digits. Leave blank if you don’t have it.' },
  min: { fr: 'Le minimum est {n}.', en: 'The minimum is {n}.' },
  max: { fr: 'Le maximum est {n}.', en: 'The maximum is {n}.' },
  supRequis: { fr: 'Indiquez au moins une superficie minimale, ou utilisez « Aidez-moi à estimer ».', en: 'Enter at least a minimum size, or use “Help me estimate”.' },
  supOrdre: { fr: 'Le maximum doit être plus grand que le minimum.', en: 'The maximum must be larger than the minimum.' },
  loyerRequis: { fr: 'Indiquez un montant approximatif. Vous pourrez l’ajuster pendant l’appel.', en: 'Enter a rough amount. You can adjust it during the call.' },
} satisfies Record<string, T>;

export const courrielValide = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
export const chiffres = (s: string) => s.replace(/\D/g, '');
export const telephoneValide = (s: string) => {
  const d = chiffres(s);
  return d.length === 10 || (d.length === 11 && d.startsWith('1'));
};
export const neqValide = (s: string) => /^\d{10}$/.test(chiffres(s)) && chiffres(s).length === s.replace(/[\s-]/g, '').length;

const estRequis = (c: Champ, r: Reponses) => (typeof c.requis === 'function' ? c.requis(r) : !!c.requis);

export function validerChamp(c: Champ, r: Reponses): T | null {
  if (!champVisible(c, r)) return null;
  const v = r[c.id];
  if (c.technique && (v === AIDE || (Array.isArray(v) && v.includes(AIDE)))) return null;

  switch (c.type) {
    case 'superficie': {
      const s = (v ?? {}) as Superficie;
      if (estRequis(c, r) && !s.min && !s.max) return MSG.supRequis;
      if (s.min && s.max && s.max < s.min) return MSG.supOrdre;
      break;
    }
    case 'loyer': {
      const l = v as Loyer | undefined;
      const montant = l ? (l.mode === 'mensuel' ? l.mensuel : l.pi2) : null;
      if (estRequis(c, r) && !(montant && montant > 0)) return MSG.loyerRequis;
      break;
    }
    case 'secteurs': {
      if (estRequis(c, r) && estVide(v)) return MSG.requisSecteurs;
      break;
    }
    case 'consentement':
      break; // géré par `valider`
    default: {
      if (estVide(v)) {
        if (!estRequis(c, r)) return null;
        if (c.type === 'tuiles' || c.type === 'importance') return MSG.requisChoix;
        if (c.type === 'nombre') return MSG.requisNombre;
        return MSG.requisTexte;
      }
      if (c.type === 'texte' && typeof v === 'string') {
        if (c.format === 'courriel' && !courrielValide(v)) return MSG.courriel;
        if (c.format === 'telephone' && !telephoneValide(v)) return MSG.telephone;
        if (c.format === 'neq' && !neqValide(v)) return MSG.neq;
      }
      if (c.type === 'nombre' && typeof v === 'number') {
        if (c.min !== undefined && v < c.min) return { fr: MSG.min.fr.replace('{n}', String(c.min)), en: MSG.min.en.replace('{n}', String(c.min)) };
        if (c.max !== undefined && v > c.max) return { fr: MSG.max.fr.replace('{n}', String(c.max)), en: MSG.max.en.replace('{n}', String(c.max)) };
      }
    }
  }
  return c.valider ? c.valider(v, r) : null;
}

export function validerEcran(e: Ecran, r: Reponses): Record<string, T> {
  const erreurs: Record<string, T> = {};
  for (const c of e.champs) {
    const m = validerChamp(c, r);
    if (m) erreurs[c.id] = m;
  }
  return erreurs;
}

export type ErreurGlobale = { ecran: string; champ: string; message: T };

/** Valide tout le formulaire (utilisé à l'envoi, côté client ET serveur). */
export function validerTout(r: Reponses): ErreurGlobale[] {
  return ecransVisibles(r).flatMap((e) =>
    Object.entries(validerEcran(e, r)).map(([champ, message]) => ({ ecran: e.id, champ, message })),
  );
}

// ---------------------------------------------------------------------------
// Progression
// ---------------------------------------------------------------------------

/** Temps moyen par écran, en secondes (cible : < 10 min au total). */
export const SECONDES_PAR_ECRAN = 18;

export function tempsRestant(r: Reponses, ecranId: string, langue: Langue): string {
  const vis = ecransVisibles(r);
  const i = Math.max(0, vis.findIndex((e) => e.id === ecranId));
  const minutes = Math.ceil(((vis.length - i) * SECONDES_PAR_ECRAN) / 60);
  return minutes <= 1
    ? (langue === 'fr' ? 'Moins d’une minute restante' : 'Less than a minute left')
    : tf({ fr: 'Environ {n} min restantes', en: 'About {n} min left' }, langue, { n: formatNombre(minutes, langue) });
}

/** Proportion complétée (0 à 1), selon les écrans visibles. */
export function progression(r: Reponses, ecranId: string): number {
  const vis = ecransVisibles(r);
  const i = vis.findIndex((e) => e.id === ecranId);
  return vis.length ? Math.max(0, i) / vis.length : 0;
}

// ---------------------------------------------------------------------------
// Repère de marché sur le budget
// ---------------------------------------------------------------------------
export type PositionBudget = { fourchette: [number, number]; pi2: number; position: 'sous' | 'dans' | 'au_dessus' };

/** Compare le budget ($/pi²/an tout compris) aux fourchettes indicatives des types choisis. */
export function positionBudget(r: Reponses): PositionBudget | null {
  const l = loyerComplet(r['budget.loyer'] as Loyer | undefined, r['espace.superficie'] as Superficie | undefined);
  const f = fourchettePour(types(r));
  if (!l?.pi2 || !f) return null;
  const position = l.pi2 < f[0] * 0.9 ? 'sous' : l.pi2 > f[1] ? 'au_dessus' : 'dans';
  return { fourchette: f, pi2: l.pi2, position };
}
