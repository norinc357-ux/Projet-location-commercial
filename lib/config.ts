/** Identité de l'agence. NOM ET COORDONNÉES PROVISOIRES : à remplacer ici seulement. */
export const AGENCE = {
  nom: 'Clé en main Commercial',
  nomCourt: 'Clé en main',
  provisoire: true,
  /** Coordonnées d'exemple (555 = numéro fictif). */
  telephone: '514 555-0100',
  telephoneLien: '+15145550100',
  courriel: 'bonjour@exemple.ca',
  adresse: { rue: '1000, rue Exemple, bureau 200', ville: 'Montréal (Québec)', codePostal: 'H3B 0A0' },
  permisOaciq: 'à compléter',
  responsableVieePrivee: 'Nom à compléter, responsable de la protection des renseignements personnels',
  heures: { fr: 'Lundi au vendredi, 8 h 30 à 18 h', en: 'Monday to Friday, 8:30 a.m. to 6 p.m.' },
} as const;
