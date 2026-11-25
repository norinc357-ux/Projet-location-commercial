/**
 * Fiche de recherche : transforme une demande en feuille de travail pour l'agent.
 * Critères obligatoires / souhaitables / éliminatoires, budget, filtres prêts à copier,
 * questions à poser pendant l'appel découverte.
 */
import type { Loyer, Reponses, Superficie } from './types';
import { versCriteres, type Critere } from './criteres';
import { qualifier, type Drapeau, type Qualification } from './qualification';
import { loyerComplet, positionBudget, type PositionBudget } from './calculs';
import { DEAL_BREAKERS, FACTEURS_EMPLACEMENT, PRIORITES, libelleType, nomSecteur } from './referentiels';
import { champsTous } from './ecrans';
import { afficherValeur, libelleRecap } from './affichage';
import { formatArgent, formatNombre } from './i18n';

const fr = (n: number) => formatNombre(n, 'fr');
const date = (iso: string) => new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));

/** Libellés des codes de critères (même vocabulaire que les caractéristiques des locaux). */
const LIBELLES: Record<string, string> = {
  type_local: 'Type de local',
  secteur: 'Secteurs',
  zone: 'Dans la zone dessinée',
  superficie_pi2: 'Superficie',
  rez_de_chaussee: 'Rez-de-chaussée',
  cout_total_mensuel: 'Coût total mensuel maximal',
  disponible_le: 'Disponible au plus tard le',
  type_bail: 'Type de bail',
  duree_bail: 'Durée du bail',
  hotte: 'Hotte avec extraction',
  entree_gaz: 'Entrée de gaz',
  zonage_permis_alcool: 'Zonage compatible avec un permis d’alcool',
  zonage_bar: 'Zonage bar',
  zonage_production_alimentaire: 'Zonage transformation alimentaire',
  ancien_restaurant: 'Ancien restaurant (équipements en place)',
  places_assises: 'Places assises',
  largeur_vitrine_pi: 'Largeur de vitrine',
  achalandage: 'Achalandage élevé',
  type_emplacement: 'Type d’emplacement',
  reception: 'Réception',
  acces_24_7: 'Accès 24/7',
  meuble: 'Meublé',
  salles_reunion: 'Salles de réunion',
  classe_immeuble: 'Classe d’immeuble',
  hauteur_libre_pi: 'Hauteur libre',
  quais: 'Quais de chargement',
  portes_sol: 'Portes au niveau du sol',
  amperage: 'Ampérage',
  espace_bureau_pi2: 'Espace bureau intégré',
  plancher_charge_elevee: 'Plancher à charge élevée',
  electricite_600v: '600 V triphasé',
  electricite_220v: 'Prises 220 V',
  zonage_usage: 'Zonage pour',
  zonage_matieres_dangereuses: 'Zonage matières dangereuses',
  temperature_controlee: 'Température contrôlée',
  temperature_froid: 'Entrepôt réfrigéré ou congelé',
  cour_remorques: 'Stationnement de remorques',
  cour_entreposage: 'Entreposage extérieur',
  cour_flotte: 'Stationnement de flotte',
  ventilation_forte: 'Ventilation forte',
  acces_camion: 'Accès camion',
  usage_bruyant_permis: 'Usage bruyant permis',
  zonage_garage: 'Zonage garage (mécanique)',
  salles_plomberie: 'Salles avec plomberie',
  salles_fermees: 'Salles fermées',
  blindage_radiologie: 'Salle de radiographie (blindage)',
  insonorisation: 'Insonorisation',
  terrasse: 'Terrasse',
  enseigne: 'Enseigne',
  entreposage: 'Entreposage',
  accessibilite: 'Accessibilité universelle',
  stationnement_clients: 'Stationnement clientèle',
};
for (const f of FACTEURS_EMPLACEMENT) LIBELLES[f.valeur] ??= f.libelle.fr;
for (const p of PRIORITES) LIBELLES[p.code] ??= p.libelle.fr;
for (const d of DEAL_BREAKERS) LIBELLES[d.valeur] ??= d.libelle.fr;

const VALEURS: Record<string, Record<string, string>> = {
  type_bail: { brut: 'brut', net: 'net', triple_net: 'triple net' },
  duree_bail: { '1_2': '1 à 2 ans', '3': '3 ans', '5': '5 ans', '10_plus': '10 ans et plus' },
  type_emplacement: { rue: 'sur rue', centre: 'centre commercial', mail: 'mail extérieur' },
  classe_immeuble: { A: 'A', B: 'B', C: 'C' },
  acces_camion: { camionnette: 'camionnette', cube: 'camion cube', remorque: 'semi-remorque' },
  zonage_usage: { entreposage: 'entreposage', distribution: 'distribution', fabrication_legere: 'fabrication légère', fabrication_lourde: 'fabrication lourde' },
};
const UNITES: Record<string, string> = {
  places_assises: 'places', largeur_vitrine_pi: 'pi', hauteur_libre_pi: 'pi', amperage: 'A', espace_bureau_pi2: 'pi²',
  salles_reunion: 'salles', salles_plomberie: 'salles', salles_fermees: 'salles', quais: '', portes_sol: '',
};

export type LigneCritere = { code: string; libelle: string; valeur: string | null; poids: number };

export function decrireCritere(c: Critere): LigneCritere {
  const libelle = LIBELLES[c.code] ?? c.code;
  const v = c.valeur;
  let valeur: string | null = null;
  if (c.code === 'type_local') valeur = (v as string[]).map((t) => libelleType(t).fr).join(', ');
  else if (c.code === 'secteur') valeur = (v as string[]).map(nomSecteur).join(', ');
  else if (c.code === 'zone') valeur = `${(v as unknown[]).length} points`;
  else if (c.code === 'superficie_pi2') {
    const s = v as Superficie;
    valeur = s.min && s.max ? `${fr(s.min)} à ${fr(s.max)} pi²` : s.min ? `au moins ${fr(s.min)} pi²` : `au plus ${fr(s.max!)} pi²`;
  } else if (c.code === 'cout_total_mensuel') valeur = `${formatArgent(v as number, 'fr')} / mois`;
  else if (c.code === 'disponible_le') valeur = date(v as string);
  else if (typeof v === 'number') valeur = `${c.operateur === 'min' ? 'au moins ' : c.operateur === 'max' ? 'au plus ' : ''}${fr(v)}${UNITES[c.code] ? ' ' + UNITES[c.code] : ''}`;
  else if (Array.isArray(v)) valeur = v.map((x) => VALEURS[c.code]?.[x] ?? x).join(', ');
  else if (typeof v === 'string') valeur = VALEURS[c.code]?.[v] ?? v;
  return { code: c.code, libelle, valeur, poids: c.poids };
}

export type Fiche = {
  client: { nom: string; entreprise: string; neq?: string; courriel: string; telephone: string; mode: string; langue: string; statut: string };
  resume: string;
  qualification: Qualification;
  obligatoires: LigneCritere[];
  souhaitables: LigneCritere[];
  eliminatoires: LigneCritere[];
  budget: { mensuel: number | null; pi2: number | null; position: PositionBudget | null; ameliorations: string | null; garantie: string | null; depot: string | null };
  filtres: { libelle: string; valeur: string }[];
  questions: string[];
  contexte: { libelle: string; valeur: string }[];
  motsDuClient: { usage?: string; description?: string; liens: string[]; localInteresse?: string };
};

const QUESTIONS_DRAPEAUX: Record<Drapeau, string> = {
  budget_sous_marche: 'Budget sous le marché : discuter des compromis possibles (secteur voisin, superficie, local à rafraîchir).',
  financement_pas_encore: 'Financement non confirmé : où en est la demande ? Une lettre de la banque est-elle possible avant l’offre ?',
  autre_courtier: 'Entente avec un autre courtier : vérifier l’exclusivité et sa date de fin avant d’aller plus loin.',
  decision_en_equipe: 'Décision en équipe : qui d’autre doit voir les locaux ? Les inviter à l’espace client.',
  fin_bail_proche: 'Fin de bail proche : vérifier le délai d’avis, l’option de renouvellement et le plan B (prolongation courte).',
  beaucoup_de_visites: 'A déjà beaucoup visité : qu’est-ce qui manquait aux locaux vus ?',
  points_a_valider: 'Plusieurs réponses « Aidez-moi » : prévoir 5 minutes de plus pour les clarifier.',
};

export function construireFiche(r: Reponses): Fiche {
  const { criteres, aValider } = versCriteres(r);
  const qualification = qualifier(r);
  const parImportance = (n: 'obligatoire' | 'souhaitable') =>
    criteres.filter((c) => c.importance === n && c.operateur !== 'exclut').map(decrireCritere).sort((a, b) => b.poids - a.poids);
  const s = (k: string) => (typeof r[k] === 'string' ? (r[k] as string) : '');
  const champ = (id: string) => champsTous().find((c) => c.id === id);
  const lisible = (id: string) => {
    const c = champ(id);
    return c ? afficherValeur(c, r[id], r, 'fr') : null;
  };

  const types = ((r['projet.types'] as string[]) ?? []).map((t) => libelleType(t).fr.toLowerCase());
  const secteurs = ((r['emplacement.secteurs'] as string[]) ?? []).filter((x) => x !== 'aide').map(nomSecteur);
  const sup = r['espace.superficie'] as Superficie | undefined;
  const loyer = loyerComplet(r['budget.loyer'] as Loyer | undefined, sup);
  const supTxt = sup?.min && sup?.max ? `${fr(sup.min)} à ${fr(sup.max)} pi²` : sup?.min ? `${fr(sup.min)} pi² et plus` : '';
  const resume = [
    `${s('entreprise.nom') || 'Entreprise'} cherche un local de type ${types.join(' ou ') || 'à préciser'}`,
    supTxt && `de ${supTxt}`,
    secteurs.length ? `dans ${secteurs.slice(0, 3).join(', ')}${secteurs.length > 3 ? ` (+${secteurs.length - 3})` : ''}` : 'secteur à conseiller',
    loyer?.mensuel ? `pour au plus ${formatArgent(loyer.mensuel, 'fr')} par mois` : '',
    lisible('projet.urgence') ? `(${lisible('projet.urgence')!.toLowerCase()})` : '',
  ].filter(Boolean).join(' ') + '.';

  // Filtres à copier dans Centris, LoopNet ou l'inventaire.
  const filtres: Fiche['filtres'] = [];
  if (types.length) filtres.push({ libelle: 'Type', valeur: types.join(', ') });
  filtres.push({ libelle: 'Secteurs', valeur: secteurs.join(', ') || 'à conseiller' });
  if (supTxt) filtres.push({ libelle: 'Superficie', valeur: `${supTxt} (élargir à ${fr(Math.round(((sup!.min ?? 0) * 0.9) / 50) * 50)} pi² et plus)` });
  if (loyer?.pi2) filtres.push({ libelle: 'Coût total max', valeur: `${formatArgent(loyer.pi2, 'fr', 2)} /pi²/an tout compris ; en triple net, loyer de base ≈ ${formatArgent(Math.max(0, loyer.pi2 - 12), 'fr')} /pi²/an (frais estimés à 12 $)` });
  const dispo = s('bail.dateLimite') || s('bail.dateIdeale');
  if (dispo) filtres.push({ libelle: 'Disponible avant', valeur: date(dispo) });
  if (r['espace.etage'] === 'rdc_obligatoire') filtres.push({ libelle: 'Étage', valeur: 'rez-de-chaussée seulement' });

  // Questions pour l'appel découverte.
  const questions: string[] = [];
  for (const id of aValider) {
    const c = champ(id);
    if (c) questions.push(`Le client veut de l’aide : « ${libelleRecap(c, 'fr').replace(/\s*\?$/, '')} »`);
  }
  for (const d of qualification.drapeaux) if (d !== 'points_a_valider') questions.push(QUESTIONS_DRAPEAUX[d]);
  if (r['entreprise.statut'] === 'demarrage') questions.push('Entreprise en démarrage : plan d’affaires, mise de fonds et garanties possibles.');
  if (r['restaurant.hotte'] === 'oui') questions.push('Type de cuisson et équipements : la hotte existante devra-t-elle être agrandie ?');
  if ((r['projet.types'] as string[] | undefined)?.includes('industriel') && !r['industriel.amperage']) questions.push('Liste des équipements pour estimer l’ampérage.');
  if (!r['mots.description']) questions.push('Faire décrire le local idéal en quelques phrases (non rempli dans le formulaire).');
  questions.push('Confirmer ce qui est vraiment obligatoire : chaque critère éliminatoire réduit le choix.');

  // Contexte (ce qui ne sert pas au filtrage mais oriente la recherche).
  const contexte: Fiche['contexte'] = [];
  for (const id of ['projet.raison', 'projet.decideur', 'projet.financement', 'projet.visites', 'actuel.superficie', 'actuel.loyer', 'actuel.finBail', 'actuel.problemes', 'espace.employes', 'espace.employes3ans', 'espace.joursBureau', 'espace.configuration', 'restaurant.concept', 'commerce.categorie', 'clinique.pratique', 'atelier.activite', 'mixte.usages', 'emplacement.adresses']) {
    const v = lisible(id);
    if (v) contexte.push({ libelle: libelleRecap(champ(id)!, 'fr'), valeur: v });
  }

  return {
    client: {
      nom: `${s('contact.prenom')} ${s('contact.nom')}`.trim(),
      entreprise: s('entreprise.nom'),
      neq: s('entreprise.neq') || undefined,
      courriel: s('contact.courriel'),
      telephone: s('contact.telephone'),
      mode: lisible('contact.mode') ?? '',
      langue: r['contact.langue'] === 'en' ? 'Anglais' : 'Français',
      statut: lisible('entreprise.statut') ?? '',
    },
    resume,
    qualification,
    obligatoires: parImportance('obligatoire'),
    souhaitables: parImportance('souhaitable'),
    eliminatoires: criteres.filter((c) => c.operateur === 'exclut').map(decrireCritere),
    budget: {
      mensuel: loyer?.mensuel ?? null,
      pi2: loyer?.pi2 ?? null,
      position: positionBudget(r),
      ameliorations: lisible('budget.ameliorations'),
      garantie: lisible('budget.garantie'),
      depot: lisible('budget.depot'),
    },
    filtres,
    questions,
    contexte,
    motsDuClient: {
      usage: s('projet.usage') || undefined,
      description: s('mots.description') || undefined,
      liens: ((r['mots.liens'] as string[]) ?? []).filter((l) => l.trim()),
      localInteresse: s('projet.localInteresse') || undefined,
    },
  };
}

/** Version texte (copier-coller dans un courriel, une note ou un CRM). */
export const NIVEAUX = { chaud: 'Prioritaire', tiede: 'À suivre', froid: 'À qualifier' } as const;

export function ficheEnTexte(f: Fiche): string {
  const l = (t: LigneCritere) => `- ${t.libelle}${t.valeur ? ` : ${t.valeur}` : ''}`;
  return [
    `FICHE DE RECHERCHE — ${f.client.entreprise} (${f.client.nom})`,
    f.resume,
    `Priorité : ${f.qualification.score}/100 (${NIVEAUX[f.qualification.niveau]})`,
    '',
    'OBLIGATOIRE',
    ...f.obligatoires.map(l),
    '',
    'SOUHAITABLE',
    ...f.souhaitables.map(l),
    ...(f.eliminatoires.length ? ['', 'À ÉCARTER', ...f.eliminatoires.map(l)] : []),
    '',
    'FILTRES',
    ...f.filtres.map((x) => `- ${x.libelle} : ${x.valeur}`),
    '',
    'À DEMANDER PENDANT L’APPEL',
    ...f.questions.map((q) => `- ${q}`),
  ].join('\n');
}
