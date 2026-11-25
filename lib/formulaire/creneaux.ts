/**
 * Créneaux de l'appel découverte (20 min).
 * Au lancement : jours ouvrables, 9 h à 16 h 30, heure de Montréal, fériés du Québec exclus.
 * À l'étape 6, la disponibilité réelle viendra des agendas Google / Microsoft 365 des agents.
 */
import { FUSEAU } from './i18n';

export const DUREE_APPEL_MIN = 20;
export const PAS_MIN = 30;
export const HEURE_DEBUT = 9;
export const HEURE_FIN = 16.5; // dernier départ à 16 h 30

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** Dimanche de Pâques (algorithme de Meeus/Jones/Butcher). */
function paques(annee: number): Date {
  const a = annee % 19, b = Math.floor(annee / 100), c = annee % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31), jour = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(annee, mois - 1, jour));
}
const nemeLundi = (annee: number, mois: number, n: number) => {
  const d = new Date(Date.UTC(annee, mois, 1));
  const decal = (8 - d.getUTCDay()) % 7; // jours jusqu'au premier lundi
  return new Date(Date.UTC(annee, mois, 1 + decal + 7 * (n - 1)));
};
const plusJours = (d: Date, n: number) => new Date(d.getTime() + n * 864e5);

/** Jours fériés du Québec (Loi sur les normes du travail) pour une année. */
export function feriesQuebec(annee: number): Set<string> {
  const p = paques(annee);
  const patriotes = (() => {
    let d = new Date(Date.UTC(annee, 4, 24));
    while (d.getUTCDay() !== 1) d = plusJours(d, -1);
    return d;
  })();
  return new Set([
    `${annee}-01-01`,
    ymd(plusJours(p, -2)), // Vendredi saint
    ymd(plusJours(p, 1)), // Lundi de Pâques
    ymd(patriotes),
    `${annee}-06-24`,
    `${annee}-07-01`,
    ymd(nemeLundi(annee, 8, 1)), // Fête du Travail
    ymd(nemeLundi(annee, 9, 2)), // Action de grâce
    `${annee}-12-25`,
  ]);
}

/** Décalage (minutes) du fuseau de Montréal à un instant donné. */
function decalage(instant: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSEAU, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(instant));
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const local = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'));
  return (local - Math.floor(instant / 60000) * 60000) / 60000;
}

/** Heure locale de Montréal → instant UTC (ISO). */
export function heureMontreal(jour: string, heure: number, minute: number): string {
  const [a, m, j] = jour.split('-').map(Number);
  const naif = Date.UTC(a, m - 1, j, heure, minute);
  const instant = naif - decalage(naif) * 60000;
  return new Date(instant - (decalage(instant) - decalage(naif)) * 60000).toISOString();
}

/** Jour (AAAA-MM-JJ) à Montréal pour un instant. */
export const jourMontreal = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

export type Creneau = { debut: string; fin: string; libre: boolean };
export type Journee = { jour: string; creneaux: Creneau[] };

/** Pseudo-disponibilité déterministe, en attendant les agendas réels (données d'exemple). */
const libreExemple = (cle: string) => {
  let h = 2166136261;
  for (const ch of cle) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) % 10 < 6;
};

export function prochainsCreneaux(maintenant = new Date(), nbJours = 5, estLibre: (iso: string) => boolean = libreExemple): Journee[] {
  const jours: Journee[] = [];
  const delaiMin = maintenant.getTime() + 2 * 3600e3; // au moins 2 h d'avis
  let curseur = new Date(`${jourMontreal(maintenant)}T12:00:00Z`);
  while (jours.length < nbJours) {
    const jour = ymd(curseur);
    const dow = curseur.getUTCDay();
    if (dow !== 0 && dow !== 6 && !feriesQuebec(curseur.getUTCFullYear()).has(jour)) {
      const creneaux: Creneau[] = [];
      for (let t = HEURE_DEBUT; t <= HEURE_FIN; t += PAS_MIN / 60) {
        const debut = heureMontreal(jour, Math.floor(t), Math.round((t % 1) * 60));
        if (new Date(debut).getTime() < delaiMin) continue;
        const fin = new Date(new Date(debut).getTime() + DUREE_APPEL_MIN * 60000).toISOString();
        creneaux.push({ debut, fin, libre: estLibre(debut) });
      }
      if (creneaux.some((c) => c.libre)) jours.push({ jour, creneaux });
    }
    curseur = plusJours(curseur, 1);
  }
  return jours;
}
