/** Texte bilingue. Le français est la langue principale (Loi 96). */
export type Langue = 'fr' | 'en';
export type T = { fr: string; en: string };

export const t = (texte: T | string | undefined, langue: Langue): string =>
  texte === undefined ? '' : typeof texte === 'string' ? texte : texte[langue];

/** Gabarit simple : remplace {cle} par la valeur. */
export const tf = (texte: T, langue: Langue, vars: Record<string, string | number>): string =>
  t(texte, langue).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

const nf = (langue: Langue, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(langue === 'fr' ? 'fr-CA' : 'en-CA', opts);

export const formatNombre = (n: number, langue: Langue) => nf(langue, { maximumFractionDigits: 0 }).format(n);
export const formatArgent = (n: number, langue: Langue, decimales = 0) =>
  nf(langue, { style: 'currency', currency: 'CAD', maximumFractionDigits: decimales, minimumFractionDigits: decimales }).format(n);

export const FUSEAU = 'America/Toronto'; // même fuseau que Montréal (Montréal n'est pas un identifiant IANA)

export const formatDateLongue = (iso: string, langue: Langue) =>
  new Intl.DateTimeFormat(langue === 'fr' ? 'fr-CA' : 'en-CA', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: FUSEAU,
  }).format(new Date(iso));

export const formatHeure = (iso: string, langue: Langue) =>
  new Intl.DateTimeFormat(langue === 'fr' ? 'fr-CA' : 'en-CA', {
    hour: 'numeric', minute: '2-digit', timeZone: FUSEAU,
  }).format(new Date(iso));

/** Textes de l'interface du formulaire (hors questions). */
export const UI = {
  continuer: { fr: 'Continuer', en: 'Continue' },
  retour: { fr: 'Retour', en: 'Back' },
  passer: { fr: 'Passer cette question', en: 'Skip this question' },
  etapeSur: { fr: 'Étape {n} sur {total}', en: 'Step {n} of {total}' },
  minutesRestantes: { fr: 'Environ {n} min restantes', en: 'About {n} min left' },
  moinsDeUneMinute: { fr: 'Moins d’une minute restante', en: 'Less than a minute left' },
  enregistre: { fr: 'Enregistré à {heure}', en: 'Saved at {heure}' },
  enregistrement: { fr: 'Enregistrement…', en: 'Saving…' },
  horsLigne: { fr: 'Enregistré sur cet appareil', en: 'Saved on this device' },
  finirPlusTard: { fr: 'Finir plus tard', en: 'Finish later' },
  aide: { fr: 'Je ne sais pas / Aidez-moi à choisir', en: 'Not sure / Help me choose' },
  aideCourt: { fr: 'Aidez-moi', en: 'Help me' },
  facultatif: { fr: 'facultatif', en: 'optional' },
  plusieursChoix: { fr: 'Plusieurs choix possibles', en: 'Choose all that apply' },
  corrigez: { fr: 'Il reste un petit détail à régler avant de continuer.', en: 'One small thing to fix before you continue.' },
  modifier: { fr: 'Modifier', en: 'Edit' },
  nonRepondu: { fr: 'Non précisé', en: 'Not specified' },
  envoyer: { fr: 'Envoyer ma demande', en: 'Send my request' },
  envoiEnCours: { fr: 'Envoi en cours…', en: 'Sending…' },
  quEstCeQue: { fr: 'Qu’est-ce que « {terme} » ?', en: 'What is “{terme}”?' },
  fermer: { fr: 'Fermer', en: 'Close' },
  exemple: { fr: 'EXEMPLE', en: 'SAMPLE' },
  langueAutre: { fr: 'English', en: 'Français' },
} satisfies Record<string, T>;
