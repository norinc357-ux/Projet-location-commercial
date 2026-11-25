/**
 * Définition déclarative du formulaire « Décrire mon projet ».
 * Une seule source pour : l'affichage, la logique conditionnelle, la validation (client ET serveur),
 * le récapitulatif et la création des critères de jumelage.
 */
import type { T } from './i18n';
import { AIDE, type Champ, type Ecran, type Option, type Reponses, type TypeLocal } from './types';
import { AGENCE } from '../config';
import { DEAL_BREAKERS, FACTEURS_EMPLACEMENT, TYPES_LOCAL } from './referentiels';

// ---------- utilitaires ----------
export const types = (r: Reponses): string[] => (Array.isArray(r['projet.types']) ? (r['projet.types'] as string[]) : []);
const aType = (ty: TypeLocal) => (r: Reponses) => types(r).includes(ty);

const ouiNon = (oui: T = { fr: 'Oui', en: 'Yes' }, non: T = { fr: 'Non', en: 'No' }): Option[] => [
  { valeur: 'oui', libelle: oui },
  { valeur: 'non', libelle: non },
];
const importance3: Option[] = [
  { valeur: 'essentiel', libelle: { fr: 'Essentiel', en: 'Essential' } },
  { valeur: 'souhaitable', libelle: { fr: 'Souhaitable', en: 'Nice to have' } },
  { valeur: 'non', libelle: { fr: 'Pas nécessaire', en: 'Not needed' } },
];

const dateInvalide = (iso: string) => Number.isNaN(new Date(iso + 'T12:00:00').getTime());
const aujourdHui = () => new Date().toISOString().slice(0, 10);

const raisonParmi = (...v: string[]) => (r: Reponses) => v.includes(String(r['projet.raison']));
const pratiqueParmi = (...v: string[]) => (r: Reponses) => v.includes(String(r['clinique.pratique']));

// ---------- écrans ----------
export const ECRANS: Ecran[] = [
  // ===== Étape 1 – Vous =====
  {
    id: 'vous-identite',
    etape: 1,
    titre: { fr: 'Faisons connaissance', en: 'Let’s get acquainted' },
    intro: {
      fr: 'Environ 10 minutes au total. Tout est enregistré au fur et à mesure : vous pouvez arrêter et reprendre quand vous voulez.',
      en: 'About 10 minutes in all. Everything is saved as you go: you can stop and pick up again any time.',
    },
    champs: [
      { id: 'contact.prenom', type: 'texte', libelle: { fr: 'Prénom', en: 'First name' }, autocomplete: 'given-name', requis: true, demi: true },
      { id: 'contact.nom', type: 'texte', libelle: { fr: 'Nom', en: 'Last name' }, autocomplete: 'family-name', requis: true, demi: true },
      {
        id: 'entreprise.nom',
        type: 'texte',
        libelle: { fr: 'Nom de l’entreprise', en: 'Company name' },
        aide: { fr: 'Pas encore de nom ? Écrivez « en démarrage ».', en: 'No name yet? Write “start-up”.' },
        autocomplete: 'organization',
        requis: true,
      },
      { id: 'entreprise.neq', type: 'texte', format: 'neq', libelle: { fr: 'NEQ', en: 'NEQ' }, lexique: 'neq', placeholder: { fr: '1234567890', en: '1234567890' } },
    ],
  },
  {
    id: 'vous-joindre',
    etape: 1,
    titre: { fr: 'Comment vous joindre ?', en: 'How can we reach you?' },
    champs: [
      { id: 'contact.courriel', type: 'texte', format: 'courriel', libelle: { fr: 'Courriel', en: 'Email' }, autocomplete: 'email', requis: true },
      { id: 'contact.telephone', type: 'texte', format: 'telephone', libelle: { fr: 'Téléphone', en: 'Phone' }, autocomplete: 'tel', requis: true, placeholder: { fr: '514 555-0123', en: '514-555-0123' } },
      {
        id: 'contact.mode',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Vous préférez qu’on vous joigne par…', en: 'You prefer we reach you by…' },
        requis: true,
        options: [
          { valeur: 'appel', libelle: { fr: 'Appel', en: 'Phone call' }, icone: 'Phone' },
          { valeur: 'texto', libelle: { fr: 'Texto', en: 'Text' }, icone: 'MessageSquare' },
          { valeur: 'courriel', libelle: { fr: 'Courriel', en: 'Email' }, icone: 'Mail' },
        ],
      },
      {
        id: 'contact.langue',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Langue de communication', en: 'Language for our communications' },
        requis: true,
        options: [
          { valeur: 'fr', libelle: { fr: 'Français', en: 'French' } },
          { valeur: 'en', libelle: { fr: 'Anglais', en: 'English' } },
        ],
      },
    ],
  },
  {
    id: 'vous-entreprise',
    etape: 1,
    titre: { fr: 'Parlez-nous de votre entreprise', en: 'Tell us about your business' },
    champs: [
      {
        id: 'entreprise.statut',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Votre entreprise est…', en: 'Your business is…' },
        requis: true,
        options: [
          { valeur: 'existante', libelle: { fr: 'Déjà en activité', en: 'Already operating' }, icone: 'Briefcase' },
          { valeur: 'demarrage', libelle: { fr: 'En démarrage', en: 'Just starting' }, icone: 'Rocket' },
        ],
      },
      {
        id: 'entreprise.secteur',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Secteur d’activité', en: 'Industry' },
        requis: true,
        options: [
          { valeur: 'detail', libelle: { fr: 'Commerce de détail', en: 'Retail' } },
          { valeur: 'restauration', libelle: { fr: 'Restauration', en: 'Food service' } },
          { valeur: 'services_pro', libelle: { fr: 'Services professionnels', en: 'Professional services' } },
          { valeur: 'techno', libelle: { fr: 'Technologie', en: 'Technology' } },
          { valeur: 'sante', libelle: { fr: 'Santé', en: 'Health care' } },
          { valeur: 'fabrication', libelle: { fr: 'Fabrication', en: 'Manufacturing' } },
          { valeur: 'logistique', libelle: { fr: 'Logistique', en: 'Logistics' } },
          { valeur: 'metiers', libelle: { fr: 'Construction et métiers', en: 'Construction and trades' } },
          { valeur: 'autre', libelle: { fr: 'Autre', en: 'Other' } },
        ],
      },
      {
        id: 'entreprise.secteurAutre',
        type: 'texte',
        libelle: { fr: 'Précisez votre secteur', en: 'Please specify your industry' },
        visible: (r) => r['entreprise.secteur'] === 'autre',
        requis: (r) => r['entreprise.secteur'] === 'autre',
      },
    ],
  },

  // ===== Étape 2 – Votre projet =====
  {
    id: 'projet-type',
    etape: 2,
    titre: { fr: 'Quel type de local cherchez-vous ?', en: 'What kind of space are you looking for?' },
    champs: [
      {
        id: 'projet.types',
        type: 'tuiles',
        multiple: true,
        requis: true,
        options: TYPES_LOCAL,
        recap: { fr: 'Type de local', en: 'Type of space' },
      },
    ],
  },
  {
    id: 'projet-usage',
    etape: 2,
    titre: { fr: 'Qu’allez-vous y faire, exactement ?', en: 'What exactly will you do there?' },
    intro: {
      fr: 'Deux ou trois phrases suffisent. Ça nous aide à vérifier le zonage dès le départ.',
      en: 'Two or three sentences are enough. It helps us check zoning from the start.',
    },
    champs: [
      {
        id: 'projet.usage',
        type: 'zone_texte',
        lignes: 4,
        max: 600,
        requis: true,
        placeholder: {
          fr: 'Ex. : Café-boulangerie avec 30 places, cuisson sur place, vente à emporter.',
          en: 'E.g.: Bakery-café with 30 seats, on-site baking, take-out.',
        },
        valider: (v) => (typeof v === 'string' && v.trim().length < 10 ? { fr: 'Ajoutez quelques mots de plus pour qu’on comprenne bien votre usage.', en: 'Add a few more words so we fully understand your use.' } : null),
        recap: { fr: 'Usage', en: 'Use' },
      },
    ],
  },
  {
    id: 'projet-raison',
    etape: 2,
    titre: { fr: 'Qu’est-ce qui motive votre recherche ?', en: 'What’s behind your search?' },
    champs: [
      {
        id: 'projet.raison',
        type: 'tuiles',
        requis: true,
        options: [
          { valeur: 'ouverture', libelle: { fr: 'Une première ouverture', en: 'A first opening' }, icone: 'Sparkles' },
          { valeur: 'agrandissement', libelle: { fr: 'On manque d’espace', en: 'We need more space' }, icone: 'TrendingUp' },
          { valeur: 'demenagement', libelle: { fr: 'Un déménagement', en: 'A move' }, icone: 'MoveRight' },
          { valeur: 'succursale', libelle: { fr: 'Une 2e succursale', en: 'A second location' }, icone: 'GitBranch' },
          { valeur: 'fin_bail', libelle: { fr: 'Mon bail se termine', en: 'My lease is ending' }, icone: 'CalendarClock' },
        ],
        recap: { fr: 'Raison', en: 'Reason' },
      },
    ],
  },
  {
    id: 'projet-urgence',
    etape: 2,
    titre: { fr: 'Quand voulez-vous emménager ?', en: 'When do you want to move in?' },
    champs: [
      {
        id: 'projet.urgence',
        type: 'tuiles',
        requis: true,
        options: [
          { valeur: 'moins_1_mois', libelle: { fr: 'Le plus vite possible (moins d’un mois)', en: 'As soon as possible (under a month)' }, icone: 'Flame' },
          { valeur: '1_3_mois', libelle: { fr: 'D’ici 1 à 3 mois', en: 'Within 1 to 3 months' } },
          { valeur: '3_6_mois', libelle: { fr: 'D’ici 3 à 6 mois', en: 'Within 3 to 6 months' } },
          { valeur: '6_12_mois', libelle: { fr: 'D’ici 6 à 12 mois', en: 'Within 6 to 12 months' } },
          { valeur: 'exploration', libelle: { fr: 'Je m’informe pour l’instant', en: 'Just exploring for now' } },
        ],
        recap: { fr: 'Échéance', en: 'Timing' },
      },
    ],
  },

  {
    id: 'projet-situation',
    etape: 2,
    visible: raisonParmi('demenagement', 'agrandissement', 'fin_bail'),
    titre: { fr: 'Et votre local actuel ?', en: 'What about your current space?' },
    intro: {
      fr: 'Ça nous donne un point de comparaison : on vous montrera ce qui change, en pi² et en dollars.',
      en: 'It gives us a baseline: we will show you what changes, in sq. ft. and in dollars.',
    },
    champs: [
      { id: 'actuel.superficie', type: 'nombre', libelle: { fr: 'Superficie actuelle', en: 'Current size' }, unite: { fr: 'pi²', en: 'sq. ft.' }, min: 0, max: 1000000, demi: true, recap: { fr: 'Local actuel', en: 'Current space' } },
      { id: 'actuel.loyer', type: 'nombre', libelle: { fr: 'Loyer actuel, tout compris', en: 'Current rent, all-in' }, unite: { fr: '$ / mois', en: '$ / month' }, min: 0, max: 10000000, demi: true },
      {
        id: 'actuel.finBail',
        type: 'date',
        demi: true,
        visible: raisonParmi('fin_bail', 'demenagement'),
        libelle: { fr: 'Fin de votre bail actuel', en: 'Current lease end date' },
        aide: { fr: 'Vérifiez aussi le délai d’avis prévu à votre bail (souvent 6 mois).', en: 'Also check the notice period in your lease (often 6 months).' },
      },
      {
        id: 'actuel.problemes',
        type: 'tuiles',
        multiple: true,
        compact: true,
        libelle: { fr: 'Qu’est-ce qui ne fonctionne plus ?', en: 'What no longer works?' },
        options: [
          { valeur: 'trop_petit', libelle: { fr: 'Trop petit', en: 'Too small' } },
          { valeur: 'trop_grand', libelle: { fr: 'Trop grand', en: 'Too big' } },
          { valeur: 'trop_cher', libelle: { fr: 'Trop cher', en: 'Too expensive' } },
          { valeur: 'mal_situe', libelle: { fr: 'Mal situé', en: 'Wrong location' } },
          { valeur: 'etat', libelle: { fr: 'En mauvais état', en: 'In poor condition' } },
          { valeur: 'image', libelle: { fr: 'Ne reflète plus notre image', en: 'No longer fits our image' } },
          { valeur: 'proprietaire', libelle: { fr: 'Relation avec le propriétaire', en: 'Relationship with the landlord' } },
        ],
      },
    ],
  },
  {
    id: 'projet-decision',
    etape: 2,
    titre: { fr: 'Comment se prendra la décision ?', en: 'How will the decision be made?' },
    intro: {
      fr: 'On adapte notre façon de travailler : un seul interlocuteur ou une équipe à convaincre, ça change tout.',
      en: 'We adapt how we work: one decision-maker or a team to convince makes all the difference.',
    },
    champs: [
      {
        id: 'projet.decideur',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Qui prendra la décision finale ?', en: 'Who will make the final decision?' },
        requis: true,
        options: [
          { valeur: 'seul', libelle: { fr: 'Moi seul', en: 'Me alone' } },
          { valeur: 'associes', libelle: { fr: 'Moi et mes associés', en: 'Me and my partners' } },
          { valeur: 'direction', libelle: { fr: 'La direction ou un conseil', en: 'Management or a board' } },
        ],
        recap: { fr: 'Décision', en: 'Decision' },
      },
      {
        id: 'projet.financement',
        type: 'tuiles',
        compact: true,
        visible: (r) => r['entreprise.statut'] === 'demarrage' || ['ouverture', 'succursale'].includes(String(r['projet.raison'])),
        libelle: { fr: 'Le financement du projet est-il en place ?', en: 'Is the project financing in place?' },
        aide: { fr: 'Les propriétaires le demandent souvent avant d’accepter une offre.', en: 'Landlords often ask before accepting an offer.' },
        requis: true,
        options: [
          { valeur: 'en_place', libelle: { fr: 'Oui, c’est confirmé', en: 'Yes, it’s confirmed' } },
          { valeur: 'en_cours', libelle: { fr: 'C’est en cours', en: 'In progress' } },
          { valeur: 'pas_encore', libelle: { fr: 'Pas encore', en: 'Not yet' } },
        ],
        recap: { fr: 'Financement', en: 'Financing' },
      },
      {
        id: 'projet.visites',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Avez-vous déjà visité des locaux ?', en: 'Have you already visited spaces?' },
        options: [
          { valeur: 'non', libelle: { fr: 'Pas encore', en: 'Not yet' } },
          { valeur: 'quelques', libelle: { fr: 'Quelques-uns', en: 'A few' } },
          { valeur: 'beaucoup', libelle: { fr: 'Beaucoup, sans succès', en: 'Many, without success' } },
        ],
      },
      {
        id: 'projet.autreCourtier',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Avez-vous signé une entente avec un autre courtier ?', en: 'Have you signed an agreement with another broker?' },
        options: ouiNon(),
      },
    ],
  },

  // ===== Étape 3 – Emplacement =====
  {
    id: 'emplacement-secteurs',
    etape: 3,
    titre: { fr: 'Dans quels secteurs ?', en: 'Which areas?' },
    intro: { fr: 'Choisissez autant de secteurs que vous voulez.', en: 'Pick as many areas as you like.' },
    champs: [{ id: 'emplacement.secteurs', type: 'secteurs', requis: true, recap: { fr: 'Secteurs', en: 'Areas' } }],
  },
  {
    id: 'emplacement-carte',
    etape: 3,
    titre: { fr: 'Des repères à proximité ?', en: 'Any landmarks to be close to?' },
    intro: {
      fr: 'Facultatif. Votre domicile, vos clients ou vos fournisseurs : on calculera les temps de trajet pour chaque local.',
      en: 'Optional. Your home, clients or suppliers: we will work out travel times for each space.',
    },
    champs: [
      { id: 'emplacement.adresses', type: 'adresses', recap: { fr: 'Adresses à proximité', en: 'Nearby addresses' } },
      { id: 'emplacement.zone', type: 'carte', libelle: { fr: 'Dessiner une zone sur la carte', en: 'Draw an area on the map' }, recap: { fr: 'Zone dessinée', en: 'Drawn area' } },
    ],
  },
  {
    id: 'emplacement-importance',
    etape: 3,
    titre: { fr: 'Qu’est-ce qui compte autour du local ?', en: 'What matters around the space?' },
    intro: { fr: 'De 1 (pas important) à 5 (essentiel).', en: 'From 1 (not important) to 5 (essential).' },
    champs: [
      {
        id: 'emplacement.importance',
        type: 'importance',
        facteurs: FACTEURS_EMPLACEMENT,
        lexique: 'achalandage',
        requis: true,
        valider: (v) => {
          const o = (v ?? {}) as Record<string, number>;
          return FACTEURS_EMPLACEMENT.every((f) => typeof o[f.valeur] === 'number')
            ? null
            : { fr: 'Donnez une note à chaque élément. Au besoin, choisissez 1.', en: 'Rate each item. If unsure, pick 1.' };
        },
        recap: { fr: 'Importance', en: 'Importance' },
      },
    ],
  },

  // ===== Étape 4 – Espace =====
  {
    id: 'espace-employes',
    etape: 4,
    titre: { fr: 'Combien de personnes y travailleront ?', en: 'How many people will work there?' },
    champs: [
      { id: 'espace.employes', type: 'nombre', libelle: { fr: 'Aujourd’hui', en: 'Today' }, min: 0, max: 5000, requis: true, demi: true, unite: { fr: 'pers.', en: 'people' } },
      { id: 'espace.employes3ans', type: 'nombre', libelle: { fr: 'Dans 3 ans', en: 'In 3 years' }, min: 0, max: 5000, demi: true, unite: { fr: 'pers.', en: 'people' }, aide: { fr: 'Une estimation suffit.', en: 'A rough guess is fine.' } },
      {
        id: 'espace.joursBureau',
        type: 'tuiles',
        compact: true,
        visible: aType('bureau'),
        libelle: { fr: 'Combien de jours par semaine l’équipe est-elle au bureau ?', en: 'How many days a week is the team in the office?' },
        aide: { fr: 'En mode hybride, on peut partager des postes et réduire la superficie.', en: 'With hybrid work, desks can be shared and the space reduced.' },
        requis: true,
        options: [
          { valeur: '5', libelle: { fr: '5 jours', en: '5 days' } },
          { valeur: '3_4', libelle: { fr: '3 ou 4 jours', en: '3 or 4 days' } },
          { valeur: '1_2', libelle: { fr: '1 ou 2 jours', en: '1 or 2 days' } },
          { valeur: 'variable', libelle: { fr: 'Ça varie', en: 'It varies' } },
        ],
      },
    ],
  },
  {
    id: 'espace-superficie',
    etape: 4,
    titre: { fr: 'Quelle superficie ?', en: 'How much space?' },
    champs: [{ id: 'espace.superficie', type: 'superficie', lexique: 'pi2', requis: true, recap: { fr: 'Superficie', en: 'Size' } }],
  },
  {
    id: 'espace-configuration',
    etape: 4,
    titre: { fr: 'Étage et aménagement', en: 'Floor and layout' },
    champs: [
      {
        id: 'espace.etage',
        type: 'tuiles',
        compact: true,
        technique: true,
        libelle: { fr: 'Le rez-de-chaussée est-il obligatoire ?', en: 'Must it be on the ground floor?' },
        requis: true,
        options: [
          { valeur: 'rdc_obligatoire', libelle: { fr: 'Oui, obligatoire', en: 'Yes, required' } },
          { valeur: 'etage_ok', libelle: { fr: 'Un étage me convient', en: 'An upper floor is fine' } },
          { valeur: 'peu_importe', libelle: { fr: 'Peu importe', en: 'No preference' } },
        ],
      },
      {
        id: 'espace.configuration',
        type: 'zone_texte',
        lignes: 3,
        max: 400,
        libelle: { fr: 'Configuration souhaitée', en: 'Preferred layout' },
        placeholder: { fr: 'Ex. : une grande pièce avant, deux bureaux fermés, un entrepôt à l’arrière.', en: 'E.g.: one large front room, two closed offices, storage at the back.' },
      },
    ],
  },

  // ===== Étape 5 – Questions selon le type =====
  {
    id: 'technique-restaurant',
    etape: 5,
    visible: aType('restaurant'),
    titre: { fr: 'Pour votre restaurant ou café', en: 'For your restaurant or café' },
    champs: [
      {
        id: 'restaurant.concept',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Votre concept', en: 'Your concept' },
        requis: true,
        options: [
          { valeur: 'cafe', libelle: { fr: 'Café ou boulangerie', en: 'Café or bakery' } },
          { valeur: 'comptoir', libelle: { fr: 'Comptoir et livraison', en: 'Counter and delivery' } },
          { valeur: 'service_complet', libelle: { fr: 'Restaurant avec service', en: 'Full-service restaurant' } },
          { valeur: 'bar', libelle: { fr: 'Bar ou brasserie', en: 'Bar or brewpub' } },
          { valeur: 'production', libelle: { fr: 'Cuisine de production, traiteur', en: 'Production kitchen, catering' } },
        ],
      },
      { id: 'restaurant.hotte', type: 'tuiles', compact: true, technique: true, lexique: 'hotte', libelle: { fr: 'Avez-vous besoin d’une hotte avec extraction ?', en: 'Do you need a hood with exhaust?' }, requis: true, options: ouiNon({ fr: 'Oui (friture, grill)', en: 'Yes (frying, grill)' }, { fr: 'Non', en: 'No' }) },
      { id: 'restaurant.gaz', type: 'tuiles', compact: true, technique: true, libelle: { fr: 'Une entrée de gaz ?', en: 'A gas line?' }, requis: true, options: ouiNon() },
      { id: 'restaurant.places', type: 'nombre', technique: true, libelle: { fr: 'Nombre de places assises', en: 'Number of seats' }, min: 0, max: 1000, unite: { fr: 'places', en: 'seats' }, requis: true },
      { id: 'restaurant.terrasse', type: 'tuiles', compact: true, libelle: { fr: 'Une terrasse ?', en: 'A patio?' }, requis: true, options: importance3 },
      { id: 'restaurant.alcool', type: 'tuiles', compact: true, technique: true, lexique: 'permisAlcool', libelle: { fr: 'Prévoyez-vous un permis d’alcool ?', en: 'Do you plan to get a liquor licence?' }, requis: true, options: ouiNon() },
      {
        id: 'restaurant.equipe',
        type: 'tuiles',
        compact: true,
        technique: true,
        libelle: { fr: 'Ancien restaurant ou local vide ?', en: 'Former restaurant or empty space?' },
        requis: true,
        options: [
          { valeur: 'equipe', libelle: { fr: 'Ancien restaurant (équipements en place)', en: 'Former restaurant (equipment in place)' } },
          { valeur: 'vide', libelle: { fr: 'Local vide', en: 'Empty space' } },
          { valeur: 'peu_importe', libelle: { fr: 'Les deux', en: 'Either' } },
        ],
      },
    ],
  },
  {
    id: 'technique-commerce',
    etape: 5,
    visible: aType('commerce'),
    titre: { fr: 'Pour votre commerce', en: 'For your store' },
    champs: [
      {
        id: 'commerce.categorie',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Que vendez-vous ?', en: 'What do you sell?' },
        requis: true,
        options: [
          { valeur: 'mode', libelle: { fr: 'Mode et accessoires', en: 'Fashion and accessories' } },
          { valeur: 'alimentation', libelle: { fr: 'Alimentation, épicerie fine', en: 'Food, specialty grocery' } },
          { valeur: 'beaute', libelle: { fr: 'Beauté et bien-être', en: 'Beauty and wellness' } },
          { valeur: 'maison', libelle: { fr: 'Maison et décoration', en: 'Home and decor' } },
          { valeur: 'services', libelle: { fr: 'Services (salon, réparation…)', en: 'Services (salon, repair…)' } },
          { valeur: 'autre', libelle: { fr: 'Autre', en: 'Other' } },
        ],
      },
      {
        id: 'commerce.emplacement',
        type: 'tuiles',
        compact: true,
        technique: true,
        libelle: { fr: 'Sur rue ou en centre commercial ?', en: 'Street front or shopping centre?' },
        requis: true,
        options: [
          { valeur: 'rue', libelle: { fr: 'Sur rue', en: 'Street front' } },
          { valeur: 'centre', libelle: { fr: 'Centre commercial', en: 'Shopping centre' } },
          { valeur: 'mail', libelle: { fr: 'Mail extérieur (stationnement devant)', en: 'Strip mall (parking in front)' } },
          { valeur: 'peu_importe', libelle: { fr: 'Peu importe', en: 'Either' } },
        ],
      },
      { id: 'commerce.vitrine', type: 'nombre', technique: true, libelle: { fr: 'Largeur de vitrine souhaitée', en: 'Desired storefront width' }, unite: { fr: 'pieds', en: 'feet' }, min: 0, max: 500, requis: true },
      { id: 'commerce.enseigne', type: 'tuiles', compact: true, libelle: { fr: 'Une enseigne sur la façade ?', en: 'A sign on the façade?' }, requis: true, options: importance3 },
      {
        id: 'commerce.achalandage',
        type: 'tuiles',
        compact: true,
        technique: true,
        lexique: 'achalandage',
        libelle: { fr: 'Quel achalandage vous faut-il ?', en: 'How much foot traffic do you need?' },
        requis: true,
        options: [
          { valeur: 'eleve', libelle: { fr: 'Élevé (artère commerciale)', en: 'High (main shopping street)' } },
          { valeur: 'moyen', libelle: { fr: 'Moyen (rue de quartier)', en: 'Medium (neighbourhood street)' } },
          { valeur: 'destination', libelle: { fr: 'Faible : les clients viennent exprès', en: 'Low: customers come on purpose' } },
        ],
      },
      { id: 'commerce.entrepot', type: 'tuiles', compact: true, libelle: { fr: 'Un entrepôt à l’arrière ?', en: 'A back storage room?' }, requis: true, options: importance3 },
      {
        id: 'commerce.heures',
        type: 'tuiles',
        multiple: true,
        compact: true,
        libelle: { fr: 'Vos heures d’ouverture', en: 'Your opening hours' },
        options: [
          { valeur: 'jour', libelle: { fr: 'Jour', en: 'Daytime' } },
          { valeur: 'soir', libelle: { fr: 'Soir', en: 'Evening' } },
          { valeur: 'fin_semaine', libelle: { fr: 'Fin de semaine', en: 'Weekends' } },
          { valeur: '24h', libelle: { fr: '24 h', en: '24 h' } },
        ],
      },
    ],
  },
  {
    id: 'technique-bureau',
    etape: 5,
    visible: aType('bureau'),
    titre: { fr: 'Pour vos bureaux', en: 'For your office' },
    champs: [
      {
        id: 'bureau.classe',
        type: 'tuiles',
        compact: true,
        technique: true,
        lexique: 'classeImmeuble',
        libelle: { fr: 'Quel standing d’immeuble ?', en: 'What building class?' },
        requis: true,
        options: [
          { valeur: 'A', libelle: { fr: 'Classe A : prestige', en: 'Class A: prestige' } },
          { valeur: 'B', libelle: { fr: 'Classe B : bon rapport qualité-prix', en: 'Class B: good value' } },
          { valeur: 'C', libelle: { fr: 'Classe C : le plus économique', en: 'Class C: most affordable' } },
        ],
      },
      {
        id: 'bureau.amenagement',
        type: 'tuiles',
        compact: true,
        technique: true,
        libelle: { fr: 'Aménagement', en: 'Layout' },
        requis: true,
        options: [
          { valeur: 'aire_ouverte', libelle: { fr: 'Aire ouverte', en: 'Open plan' } },
          { valeur: 'fermes', libelle: { fr: 'Bureaux fermés', en: 'Private offices' } },
          { valeur: 'mixte', libelle: { fr: 'Un mélange des deux', en: 'A mix of both' } },
        ],
      },
      { id: 'bureau.salles', type: 'nombre', technique: true, libelle: { fr: 'Salles de réunion', en: 'Meeting rooms' }, min: 0, max: 50, unite: { fr: 'salles', en: 'rooms' }, requis: true, demi: true },
      { id: 'bureau.reception', type: 'tuiles', compact: true, libelle: { fr: 'Une réception ?', en: 'A reception area?' }, requis: true, options: ouiNon() },
      { id: 'bureau.acces247', type: 'tuiles', compact: true, libelle: { fr: 'Accès 24 h sur 24, 7 jours sur 7 ?', en: '24/7 access?' }, requis: true, options: ouiNon() },
      {
        id: 'bureau.meuble',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Meublé ?', en: 'Furnished?' },
        requis: true,
        options: [
          { valeur: 'oui', libelle: { fr: 'Oui', en: 'Yes' } },
          { valeur: 'non', libelle: { fr: 'Non', en: 'No' } },
          { valeur: 'peu_importe', libelle: { fr: 'Peu importe', en: 'Either' } },
        ],
      },
    ],
  },
  {
    id: 'technique-industriel',
    etape: 5,
    visible: aType('industriel'),
    titre: { fr: 'Pour votre espace industriel ou entrepôt', en: 'For your industrial space or warehouse' },
    champs: [
      { id: 'industriel.hauteurLibre', type: 'nombre', technique: true, lexique: 'hauteurLibre', libelle: { fr: 'Hauteur libre minimale', en: 'Minimum clear height' }, unite: { fr: 'pieds', en: 'feet' }, min: 8, max: 60, requis: true },
      { id: 'industriel.quais', type: 'nombre', technique: true, lexique: 'quai', libelle: { fr: 'Quais de chargement', en: 'Loading docks' }, min: 0, max: 100, requis: true, demi: true },
      { id: 'industriel.portesSol', type: 'nombre', technique: true, libelle: { fr: 'Portes au niveau du sol', en: 'Drive-in doors' }, min: 0, max: 100, requis: true, demi: true },
      {
        id: 'industriel.plancher',
        type: 'tuiles',
        compact: true,
        technique: true,
        lexique: 'chargePlancher',
        libelle: { fr: 'Charge du plancher', en: 'Floor load' },
        requis: true,
        options: [
          { valeur: 'standard', libelle: { fr: 'Standard', en: 'Standard' } },
          { valeur: 'elevee', libelle: { fr: 'Élevée (machinerie, rayonnages hauts)', en: 'High (machinery, tall racking)' } },
        ],
      },
      {
        id: 'industriel.electricite',
        type: 'tuiles',
        compact: true,
        technique: true,
        lexique: 'electricite600',
        libelle: { fr: 'Électricité', en: 'Power' },
        requis: true,
        options: [
          { valeur: 'standard', libelle: { fr: 'Standard', en: 'Standard' } },
          { valeur: '600v', libelle: { fr: '600 V triphasé', en: '600 V three-phase' } },
        ],
      },
      { id: 'industriel.amperage', type: 'nombre', libelle: { fr: 'Ampérage requis', en: 'Required amperage' }, unite: { fr: 'A', en: 'A' }, min: 0, max: 10000, visible: (r) => r['industriel.electricite'] === '600v' },
      {
        id: 'industriel.usage',
        type: 'tuiles',
        multiple: true,
        compact: true,
        technique: true,
        lexique: 'zonage',
        libelle: { fr: 'Activités prévues (pour le zonage)', en: 'Planned activities (for zoning)' },
        requis: true,
        options: [
          { valeur: 'entreposage', libelle: { fr: 'Entreposage', en: 'Storage' } },
          { valeur: 'distribution', libelle: { fr: 'Distribution', en: 'Distribution' } },
          { valeur: 'fabrication_legere', libelle: { fr: 'Fabrication légère', en: 'Light manufacturing' } },
          { valeur: 'fabrication_lourde', libelle: { fr: 'Fabrication lourde', en: 'Heavy manufacturing' } },
        ],
      },
      { id: 'industriel.bureaux', type: 'nombre', libelle: { fr: 'Espace bureau intégré', en: 'Built-in office space' }, unite: { fr: 'pi²', en: 'sq. ft.' }, min: 0, max: 100000, aide: { fr: 'Inscrivez 0 si vous n’en avez pas besoin.', en: 'Enter 0 if you don’t need any.' } },
      {
        id: 'industriel.cour',
        type: 'tuiles',
        multiple: true,
        compact: true,
        libelle: { fr: 'Besoins à l’extérieur', en: 'Outdoor needs' },
        options: [
          { valeur: 'remorques', libelle: { fr: 'Stationnement de remorques', en: 'Trailer parking' } },
          { valeur: 'entreposage', libelle: { fr: 'Entreposage extérieur', en: 'Outdoor storage' } },
          { valeur: 'flotte', libelle: { fr: 'Flotte de véhicules', en: 'Vehicle fleet' } },
        ],
      },
      {
        id: 'industriel.temperature',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Température', en: 'Temperature' },
        requis: true,
        options: [
          { valeur: 'ambiante', libelle: { fr: 'Ambiante', en: 'Ambient' } },
          { valeur: 'controlee', libelle: { fr: 'Contrôlée', en: 'Controlled' } },
          { valeur: 'froid', libelle: { fr: 'Réfrigérée ou congelée', en: 'Refrigerated or frozen' } },
        ],
      },
      {
        id: 'industriel.matieres',
        type: 'tuiles',
        compact: true,
        technique: true,
        libelle: { fr: 'Matières dangereuses ou inflammables ?', en: 'Hazardous or flammable materials?' },
        aide: { fr: 'Ça change le zonage, les gicleurs et l’assurance : mieux vaut le savoir tôt.', en: 'It affects zoning, sprinklers and insurance: better to know early.' },
        requis: true,
        options: ouiNon(),
      },
    ],
  },
  {
    id: 'technique-clinique',
    etape: 5,
    visible: aType('clinique'),
    titre: { fr: 'Pour votre clinique', en: 'For your clinic' },
    champs: [
      {
        id: 'clinique.pratique',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Votre pratique', en: 'Your practice' },
        requis: true,
        options: [
          { valeur: 'medecine', libelle: { fr: 'Médecine', en: 'Medicine' } },
          { valeur: 'dentaire', libelle: { fr: 'Dentaire', en: 'Dental' } },
          { valeur: 'physio', libelle: { fr: 'Physio, ostéo, chiro', en: 'Physio, osteo, chiro' } },
          { valeur: 'psycho', libelle: { fr: 'Psychologie, thérapie', en: 'Psychology, therapy' } },
          { valeur: 'esthetique', libelle: { fr: 'Médecine esthétique', en: 'Aesthetic medicine' } },
          { valeur: 'veterinaire', libelle: { fr: 'Vétérinaire', en: 'Veterinary' } },
          { valeur: 'autre', libelle: { fr: 'Autre', en: 'Other' } },
        ],
      },
      { id: 'clinique.salles', type: 'nombre', libelle: { fr: 'Salles de consultation ou de traitement', en: 'Consultation or treatment rooms' }, min: 1, max: 200, unite: { fr: 'salles', en: 'rooms' }, requis: true },
      {
        id: 'clinique.imagerie',
        type: 'tuiles',
        compact: true,
        technique: true,
        visible: pratiqueParmi('dentaire', 'medecine', 'veterinaire'),
        libelle: { fr: 'Appareils de radiographie ?', en: 'X-ray equipment?' },
        aide: { fr: 'Les salles de radiographie demandent un blindage et parfois une dalle renforcée.', en: 'X-ray rooms need shielding and sometimes a reinforced floor.' },
        requis: true,
        options: ouiNon(),
      },
      { id: 'clinique.sallesPlomberie', type: 'nombre', technique: true, libelle: { fr: 'Salles avec lavabo ou plomberie', en: 'Rooms with a sink or plumbing' }, min: 0, max: 100, unite: { fr: 'salles', en: 'rooms' }, requis: true },
      { id: 'clinique.insonorisation', type: 'tuiles', compact: true, technique: true, lexique: 'insonorisation', libelle: { fr: 'Insonorisation entre les salles', en: 'Soundproofing between rooms' }, requis: true, options: importance3 },
      { id: 'clinique.accessibilite', type: 'tuiles', compact: true, technique: true, lexique: 'accessibiliteUniverselle', libelle: { fr: 'Accessibilité universelle', en: 'Universal accessibility' }, requis: true, options: importance3 },
      { id: 'clinique.stationnement', type: 'tuiles', compact: true, libelle: { fr: 'Stationnement pour les patients', en: 'Patient parking' }, requis: true, options: importance3 },
    ],
  },
  {
    id: 'technique-atelier',
    etape: 5,
    visible: aType('atelier'),
    titre: { fr: 'Pour votre atelier', en: 'For your workshop' },
    champs: [
      {
        id: 'atelier.activite',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Votre activité', en: 'Your activity' },
        requis: true,
        options: [
          { valeur: 'bois', libelle: { fr: 'Ébénisterie, bois', en: 'Woodworking' } },
          { valeur: 'metal', libelle: { fr: 'Métal, soudure', en: 'Metal, welding' } },
          { valeur: 'impression', libelle: { fr: 'Impression, enseignes', en: 'Printing, signs' } },
          { valeur: 'creation', libelle: { fr: 'Studio de création, artisanat', en: 'Creative studio, crafts' } },
          { valeur: 'mecanique', libelle: { fr: 'Mécanique automobile', en: 'Auto repair' } },
          { valeur: 'alimentaire', libelle: { fr: 'Transformation alimentaire', en: 'Food processing' } },
          { valeur: 'autre', libelle: { fr: 'Autre', en: 'Other' } },
        ],
      },
      {
        id: 'atelier.ventilation',
        type: 'tuiles',
        compact: true,
        technique: true,
        libelle: { fr: 'Ventilation', en: 'Ventilation' },
        requis: true,
        options: [
          { valeur: 'standard', libelle: { fr: 'Standard', en: 'Standard' } },
          { valeur: 'forte', libelle: { fr: 'Forte (poussière, vapeurs, peinture)', en: 'Strong (dust, fumes, paint)' } },
        ],
      },
      {
        id: 'atelier.bruit',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Niveau de bruit de vos activités', en: 'Noise level of your work' },
        requis: true,
        options: [
          { valeur: 'faible', libelle: { fr: 'Faible', en: 'Low' } },
          { valeur: 'moyen', libelle: { fr: 'Moyen', en: 'Medium' } },
          { valeur: 'eleve', libelle: { fr: 'Élevé', en: 'High' } },
        ],
      },
      {
        id: 'atelier.electricite',
        type: 'tuiles',
        compact: true,
        technique: true,
        lexique: 'electricite600',
        libelle: { fr: 'Électricité', en: 'Power' },
        requis: true,
        options: [
          { valeur: 'standard', libelle: { fr: 'Standard', en: 'Standard' } },
          { valeur: '220v', libelle: { fr: 'Prises 220 V', en: '220 V outlets' } },
          { valeur: '600v', libelle: { fr: '600 V triphasé', en: '600 V three-phase' } },
        ],
      },
      {
        id: 'atelier.camion',
        type: 'tuiles',
        compact: true,
        libelle: { fr: 'Accès camion', en: 'Truck access' },
        requis: true,
        options: [
          { valeur: 'non', libelle: { fr: 'Pas nécessaire', en: 'Not needed' } },
          { valeur: 'camionnette', libelle: { fr: 'Camionnette', en: 'Van' } },
          { valeur: 'cube', libelle: { fr: 'Camion cube', en: 'Box truck' } },
          { valeur: 'remorque', libelle: { fr: 'Semi-remorque', en: 'Semi-trailer' } },
        ],
      },
    ],
  },

  {
    id: 'technique-mixte',
    etape: 5,
    visible: aType('mixte'),
    titre: { fr: 'Pour votre local mixte', en: 'For your mixed-use space' },
    champs: [
      {
        id: 'mixte.usages',
        type: 'zone_texte',
        lignes: 3,
        max: 400,
        requis: true,
        libelle: { fr: 'Quels usages combinez-vous, et dans quelle proportion ?', en: 'Which uses are you combining, and in what proportion?' },
        placeholder: { fr: 'Ex. : boutique à l’avant (60 %), atelier de couture à l’arrière (40 %).', en: 'E.g.: shop at the front (60%), sewing workshop at the back (40%).' },
      },
    ],
  },

  // ===== Étape 6 – Budget et bail =====
  {
    id: 'budget-loyer',
    etape: 6,
    titre: { fr: 'Quel est votre budget de loyer ?', en: 'What is your rent budget?' },
    intro: {
      fr: 'Indiquez-le comme c’est le plus simple pour vous : on fait la conversion.',
      en: 'Enter it whichever way is easiest for you: we do the conversion.',
    },
    champs: [{ id: 'budget.loyer', type: 'loyer', lexique: 'loyerPi2', requis: true, recap: { fr: 'Budget de loyer', en: 'Rent budget' } }],
  },
  {
    id: 'budget-bail',
    etape: 6,
    titre: { fr: 'Le bail', en: 'The lease' },
    champs: [
      {
        id: 'bail.type',
        type: 'tuiles',
        technique: true,
        libelle: { fr: 'Type de bail préféré', en: 'Preferred type of lease' },
        requis: true,
        options: [
          { valeur: 'brut', libelle: { fr: 'Brut', en: 'Gross' }, description: { fr: 'Un loyer tout compris', en: 'One all-in rent' } },
          { valeur: 'net', libelle: { fr: 'Net', en: 'Net' }, description: { fr: 'Loyer + une partie des frais', en: 'Rent + some costs' } },
          { valeur: 'triple_net', libelle: { fr: 'Triple net', en: 'Triple net' }, description: { fr: 'Loyer + taxes, assurance, entretien', en: 'Rent + taxes, insurance, upkeep' } },
        ],
        lexique: ['bailBrut', 'bailNet', 'bailTripleNet', 'fraisExploitation'],
      },
      {
        id: 'bail.duree',
        type: 'tuiles',
        compact: true,
        technique: true,
        lexique: 'dureeBail',
        libelle: { fr: 'Durée souhaitée', en: 'Preferred term' },
        requis: true,
        options: [
          { valeur: '1_2', libelle: { fr: '1 à 2 ans', en: '1 to 2 years' } },
          { valeur: '3', libelle: { fr: '3 ans', en: '3 years' } },
          { valeur: '5', libelle: { fr: '5 ans', en: '5 years' } },
          { valeur: '10_plus', libelle: { fr: '10 ans et plus', en: '10+ years' } },
        ],
      },
    ],
  },
  {
    id: 'budget-dates',
    etape: 6,
    titre: { fr: 'Vos dates', en: 'Your dates' },
    champs: [
      {
        id: 'bail.dateIdeale',
        type: 'date',
        demi: true,
        libelle: { fr: 'Date d’emménagement idéale', en: 'Ideal move-in date' },
        requis: true,
        valider: (v) => (typeof v === 'string' && v && v < aujourdHui() ? { fr: 'Cette date est déjà passée. Choisissez une date à venir.', en: 'This date has passed. Please choose a future date.' } : null),
      },
      {
        id: 'bail.dateLimite',
        type: 'date',
        demi: true,
        libelle: { fr: 'Date limite', en: 'Latest date' },
        aide: { fr: 'Au-delà, ce serait un problème.', en: 'After this, it becomes a problem.' },
        valider: (v, r) =>
          typeof v === 'string' && v && typeof r['bail.dateIdeale'] === 'string' && v < (r['bail.dateIdeale'] as string)
            ? { fr: 'La date limite doit suivre la date idéale.', en: 'The latest date must come after the ideal date.' }
            : v && dateInvalide(v as string)
              ? { fr: 'Date invalide.', en: 'Invalid date.' }
              : null,
      },
    ],
  },
  {
    id: 'budget-garanties',
    etape: 6,
    titre: { fr: 'Travaux et garanties', en: 'Improvements and guarantees' },
    champs: [
      {
        id: 'budget.ameliorations',
        type: 'tuiles',
        compact: true,
        technique: true,
        lexique: 'ameliorationsLocatives',
        libelle: { fr: 'Budget pour les améliorations locatives', en: 'Budget for leasehold improvements' },
        requis: true,
        options: [
          { valeur: 'aucun', libelle: { fr: 'Aucun : clé en main', en: 'None: move-in ready' } },
          { valeur: 'moins_25k', libelle: { fr: 'Moins de 25 000 $', en: 'Under $25,000' } },
          { valeur: '25_75k', libelle: { fr: '25 000 à 75 000 $', en: '$25,000 to $75,000' } },
          { valeur: '75_150k', libelle: { fr: '75 000 à 150 000 $', en: '$75,000 to $150,000' } },
          { valeur: 'plus_150k', libelle: { fr: 'Plus de 150 000 $', en: 'Over $150,000' } },
        ],
      },
      {
        id: 'budget.garantie',
        type: 'tuiles',
        compact: true,
        lexique: 'garantiePersonnelle',
        libelle: { fr: 'Ouvert à une garantie personnelle ?', en: 'Open to a personal guarantee?' },
        requis: true,
        options: [
          { valeur: 'oui', libelle: { fr: 'Oui', en: 'Yes' } },
          { valeur: 'a_discuter', libelle: { fr: 'À discuter', en: 'Open to discuss' } },
          { valeur: 'non', libelle: { fr: 'Non', en: 'No' } },
        ],
      },
      {
        id: 'budget.depot',
        type: 'tuiles',
        compact: true,
        lexique: 'depot',
        libelle: { fr: 'Ouvert à verser un dépôt ?', en: 'Open to paying a deposit?' },
        requis: true,
        options: [
          { valeur: 'oui', libelle: { fr: 'Oui', en: 'Yes' } },
          { valeur: 'a_discuter', libelle: { fr: 'À discuter', en: 'Open to discuss' } },
          { valeur: 'non', libelle: { fr: 'Non', en: 'No' } },
        ],
      },
    ],
  },

  // ===== Étape 7 – Priorités =====
  {
    id: 'priorites-criteres',
    etape: 7,
    titre: { fr: 'Qu’est-ce qui est obligatoire pour vous ?', en: 'What is a must-have for you?' },
    intro: {
      fr: 'Pour chaque élément : obligatoire, souhaitable ou pas important. Les éléments obligatoires écartent les locaux qui ne les ont pas.',
      en: 'For each item: must-have, nice to have or not important. Must-haves rule out spaces that lack them.',
    },
    champs: [{ id: 'priorites.criteres', type: 'priorites', recap: { fr: 'Priorités', en: 'Priorities' } }],
  },
  {
    id: 'priorites-eliminatoires',
    etape: 7,
    titre: { fr: 'Qu’est-ce qui serait un non catégorique ?', en: 'What would be an absolute no?' },
    intro: { fr: 'Facultatif. On ne vous proposera jamais un local qui en contient un.', en: 'Optional. We will never propose a space that has one.' },
    champs: [
      { id: 'priorites.eliminatoires', type: 'tuiles', multiple: true, compact: true, lexique: 'dealBreaker', options: DEAL_BREAKERS, recap: { fr: 'Éliminatoires', en: 'Deal-breakers' } },
      { id: 'priorites.eliminatoiresAutre', type: 'texte', libelle: { fr: 'Autre élément éliminatoire', en: 'Other deal-breaker' } },
    ],
  },

  // ===== Étape 8 – Dans vos mots =====
  {
    id: 'mots-description',
    etape: 8,
    titre: { fr: 'Décrivez votre local idéal', en: 'Describe your ideal space' },
    intro: {
      fr: 'Comme si vous le racontiez à un ami. Ce que vous voyez en entrant, l’ambiance, ce qui vous ferait dire « c’est celui-là ».',
      en: 'As if you were telling a friend. What you see when you walk in, the feel, what would make you say “this is the one”.',
    },
    champs: [{ id: 'mots.description', type: 'zone_texte', lignes: 7, max: 3000, recap: { fr: 'Votre description', en: 'Your description' } }],
  },
  {
    id: 'mots-fichiers',
    etape: 8,
    titre: { fr: 'Des images ou des liens à partager ?', en: 'Any images or links to share?' },
    intro: { fr: 'Facultatif. Photos d’inspiration, plan, annonces de locaux qui vous plaisent déjà.', en: 'Optional. Inspiration photos, a floor plan, listings you already like.' },
    champs: [
      { id: 'mots.fichiers', type: 'fichiers', recap: { fr: 'Fichiers', en: 'Files' } },
      { id: 'mots.liens', type: 'liens', recap: { fr: 'Liens', en: 'Links' } },
    ],
  },

  // ===== Étape 9 – Récapitulatif + rendez-vous =====
  {
    id: 'recap',
    etape: 9,
    titre: { fr: 'Tout est-il exact ?', en: 'Is everything correct?' },
    intro: { fr: 'Touchez « Modifier » pour corriger une section. Vous reviendrez ici ensuite.', en: 'Tap “Edit” to fix a section. You will come back here afterwards.' },
    champs: [{ id: 'recap', type: 'recap' }],
  },
  {
    id: 'rendezvous',
    etape: 9,
    titre: { fr: 'Réservez votre appel découverte', en: 'Book your discovery call' },
    intro: {
      fr: '20 minutes avec un agent pour confirmer vos besoins. C’est après cet appel qu’on lance la recherche.',
      en: '20 minutes with an agent to confirm your needs. We start the search right after this call.',
    },
    champs: [
      { id: 'rdv.creneau', type: 'rendezvous', recap: { fr: 'Appel découverte', en: 'Discovery call' } },
      {
        id: 'consentement.loi25',
        type: 'consentement',
        requis: true,
        texte: {
          fr: `J’accepte que ${AGENCE.nom} utilise ces renseignements pour traiter ma demande, me proposer des locaux et les transmettre aux propriétaires concernés, comme le décrit la politique de confidentialité.`,
          en: `I agree that ${AGENCE.nom} may use this information to process my request, propose spaces and share it with the landlords concerned, as described in the privacy policy.`,
        },
        lien: { libelle: { fr: 'Politique de confidentialité', en: 'Privacy policy' }, href: { fr: '/confidentialite', en: '/en/privacy' } },
        valider: (v) => (v === true ? null : { fr: 'Votre accord est nécessaire pour qu’on puisse traiter votre demande.', en: 'We need your consent to process your request.' }),
      },
      {
        id: 'consentement.marketing',
        type: 'consentement',
        texte: {
          fr: 'Facultatif : j’aimerais recevoir des nouvelles et des conseils sur le marché locatif commercial (environ une fois par mois, désabonnement en un clic).',
          en: 'Optional: I would like to receive news and tips on the commercial leasing market (about once a month, one-click unsubscribe).',
        },
      },
    ],
  },
];

export const ecranParId = (id: string) => ECRANS.find((e) => e.id === id);
export const champsTous = (): Champ[] => ECRANS.flatMap((e) => e.champs);

export const ecranVisible = (e: Ecran, r: Reponses) => (e.visible ? e.visible(r) : true);
export const champVisible = (c: Champ, r: Reponses) => (c.visible ? c.visible(r) : true);
export const ecransVisibles = (r: Reponses) => ECRANS.filter((e) => ecranVisible(e, r));

export { AIDE };
