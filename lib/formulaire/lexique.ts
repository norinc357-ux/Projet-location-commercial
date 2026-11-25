import type { T } from './i18n';

/**
 * Lexique : source unique des définitions.
 * Réutilisé par les infobulles « ? » du formulaire et, à l'étape 3, par la page Lexique du Guide du locataire.
 */
export type Terme = { terme: T; definition: T };

export const LEXIQUE = {
  neq: {
    terme: { fr: 'NEQ', en: 'NEQ' },
    definition: {
      fr: 'Le numéro d’entreprise du Québec, attribué par le Registraire des entreprises. Il compte 10 chiffres. Si vous démarrez, laissez vide : on s’en occupera plus tard.',
      en: 'The Québec enterprise number, issued by the Registraire des entreprises. It has 10 digits. If you are just starting out, leave it blank: we will deal with it later.',
    },
  },
  achalandage: {
    terme: { fr: 'Achalandage', en: 'Foot traffic' },
    definition: {
      fr: 'Le nombre de personnes qui passent devant le local. Essentiel pour un commerce ou un restaurant qui vit des clients de passage.',
      en: 'How many people walk past the space. Essential for a shop or restaurant that relies on walk-in customers.',
    },
  },
  pi2: {
    terme: { fr: 'pi² (pied carré)', en: 'sq. ft. (square foot)' },
    definition: {
      fr: 'L’unité utilisée dans les baux commerciaux au Québec. 1 m² = environ 10,76 pi². Un bureau de 10 personnes occupe souvent 1 500 à 2 000 pi².',
      en: 'The unit used in Québec commercial leases. 1 m² ≈ 10.76 sq. ft. A 10-person office often takes 1,500 to 2,000 sq. ft.',
    },
  },
  loyerPi2: {
    terme: { fr: 'Loyer au pi² par année', en: 'Rent per sq. ft. per year' },
    definition: {
      fr: 'La façon dont les loyers commerciaux sont annoncés à Montréal. Exemple : 25 $/pi²/an pour 1 000 pi² = 25 000 $ par année, soit environ 2 083 $ par mois, avant frais et taxes.',
      en: 'How commercial rents are quoted in Montréal. Example: $25/sq. ft./yr for 1,000 sq. ft. = $25,000 a year, about $2,083 a month, before costs and taxes.',
    },
  },
  bailBrut: {
    terme: { fr: 'Bail brut', en: 'Gross lease' },
    definition: {
      fr: 'Vous payez un loyer unique ; le propriétaire paie les taxes foncières, l’assurance de l’immeuble et l’entretien. Plus simple à prévoir, souvent plus cher au pi².',
      en: 'You pay one rent; the landlord pays property taxes, building insurance and maintenance. Easier to budget, often pricier per sq. ft.',
    },
  },
  bailNet: {
    terme: { fr: 'Bail net', en: 'Net lease' },
    definition: {
      fr: 'Vous payez le loyer de base plus une partie des frais de l’immeuble (souvent les taxes foncières). Le reste demeure au propriétaire.',
      en: 'You pay base rent plus part of the building costs (often property taxes). The landlord covers the rest.',
    },
  },
  bailTripleNet: {
    terme: { fr: 'Bail triple net (NNN)', en: 'Triple net lease (NNN)' },
    definition: {
      fr: 'Vous payez le loyer de base plus votre part des taxes foncières, de l’assurance et de l’entretien de l’immeuble. Le plus courant en commercial à Montréal. Le loyer affiché semble bas : il faut ajouter les frais d’exploitation.',
      en: 'You pay base rent plus your share of property taxes, insurance and building maintenance. The most common type in Montréal. The advertised rent looks low: add operating costs.',
    },
  },
  fraisExploitation: {
    terme: { fr: 'Frais d’exploitation (CAM)', en: 'Operating costs (CAM)' },
    definition: {
      fr: 'Votre part des dépenses communes de l’immeuble : taxes, assurance, déneigement, entretien, gestion. Elle s’ajoute au loyer de base dans un bail net ou triple net, souvent 8 à 20 $/pi²/an.',
      en: 'Your share of the building’s shared expenses: taxes, insurance, snow removal, maintenance, management. Added to base rent in a net or triple net lease, often $8 to $20/sq. ft./yr.',
    },
  },
  ameliorationsLocatives: {
    terme: { fr: 'Améliorations locatives', en: 'Leasehold improvements' },
    definition: {
      fr: 'Les travaux pour adapter le local à votre entreprise : cloisons, éclairage, cuisine, plomberie. Le propriétaire en paie parfois une partie (allocation), surtout pour un bail de 5 ans et plus.',
      en: 'Work to fit the space to your business: walls, lighting, kitchen, plumbing. The landlord sometimes pays part of it (an allowance), especially for leases of 5 years or more.',
    },
  },
  garantiePersonnelle: {
    terme: { fr: 'Garantie personnelle', en: 'Personal guarantee' },
    definition: {
      fr: 'Votre engagement personnel à payer le loyer si votre entreprise ne le peut pas. Souvent demandée aux entreprises en démarrage. Elle se négocie : durée limitée, montant plafonné.',
      en: 'Your personal promise to pay the rent if your company cannot. Often required from start-ups. It is negotiable: limited term, capped amount.',
    },
  },
  depot: {
    terme: { fr: 'Dépôt de garantie', en: 'Security deposit' },
    definition: {
      fr: 'Une somme versée au propriétaire à la signature, souvent l’équivalent de 1 à 3 mois de loyer. Elle peut remplacer ou réduire une garantie personnelle.',
      en: 'An amount paid to the landlord at signing, often 1 to 3 months of rent. It can replace or reduce a personal guarantee.',
    },
  },
  hauteurLibre: {
    terme: { fr: 'Hauteur libre', en: 'Clear height' },
    definition: {
      fr: 'La hauteur utilisable entre le plancher et l’obstacle le plus bas du plafond (poutre, gicleur). Elle détermine combien de niveaux de palettes vous pouvez empiler.',
      en: 'Usable height between the floor and the lowest ceiling obstruction (beam, sprinkler). It sets how many pallet levels you can stack.',
    },
  },
  quai: {
    terme: { fr: 'Quai de chargement', en: 'Loading dock' },
    definition: {
      fr: 'Une porte surélevée à la hauteur d’une remorque de camion, pour charger directement. Une porte au niveau du sol, elle, sert aux camionnettes et aux chariots.',
      en: 'A door raised to truck-trailer height for direct loading. A drive-in (grade-level) door serves vans and forklifts.',
    },
  },
  chargePlancher: {
    terme: { fr: 'Charge du plancher', en: 'Floor load' },
    definition: {
      fr: 'Le poids que le plancher peut supporter, en livres par pi². Important pour la machinerie lourde, les rayonnages hauts ou les archives.',
      en: 'The weight the floor can carry, in pounds per sq. ft. Important for heavy machinery, tall racking or archives.',
    },
  },
  electricite600: {
    terme: { fr: 'Ampérage et 600 V', en: 'Amperage and 600 V' },
    definition: {
      fr: 'La capacité électrique du local. Le 600 V triphasé alimente la machinerie industrielle. Si vous ne connaissez pas vos besoins, indiquez vos équipements : on fera le calcul.',
      en: 'The space’s electrical capacity. 600 V three-phase powers industrial machinery. If you don’t know your needs, list your equipment: we will do the math.',
    },
  },
  zonage: {
    terme: { fr: 'Zonage', en: 'Zoning' },
    definition: {
      fr: 'Les usages que la Ville permet à une adresse (commerce, bureau, industrie légère, restauration…). Un local mal zoné peut bloquer votre permis d’exploitation : on le vérifie pour chaque local proposé.',
      en: 'The uses the city allows at an address (retail, office, light industry, food service…). A space with the wrong zoning can block your operating permit: we check it for every space we propose.',
    },
  },
  hotte: {
    terme: { fr: 'Hotte et extraction', en: 'Hood and exhaust' },
    definition: {
      fr: 'Le système qui évacue la fumée et la graisse de la cuisine jusqu’au toit. Coûteux à installer (souvent 30 000 $ et plus) : un local déjà équipé fait gagner du temps et de l’argent.',
      en: 'The system that vents kitchen smoke and grease to the roof. Costly to install (often $30,000+): a space already equipped saves time and money.',
    },
  },
  permisAlcool: {
    terme: { fr: 'Permis d’alcool', en: 'Liquor licence' },
    definition: {
      fr: 'Délivré par la Régie des alcools, des courses et des jeux (RACJ). Les délais peuvent atteindre plusieurs mois ; l’emplacement et le zonage influencent l’obtention.',
      en: 'Issued by the Régie des alcools, des courses et des jeux (RACJ). It can take several months; location and zoning affect approval.',
    },
  },
  accessibiliteUniverselle: {
    terme: { fr: 'Accessibilité universelle', en: 'Universal accessibility' },
    definition: {
      fr: 'Un accès sans marche, des portes assez larges et des toilettes adaptées pour les personnes à mobilité réduite. Souvent exigé pour une clinique.',
      en: 'Step-free access, wide enough doors and adapted washrooms for people with reduced mobility. Often required for a clinic.',
    },
  },
  insonorisation: {
    terme: { fr: 'Insonorisation', en: 'Soundproofing' },
    definition: {
      fr: 'L’isolation acoustique entre les pièces, pour la confidentialité des consultations ou pour éviter de déranger les voisins.',
      en: 'Acoustic insulation between rooms, for confidential consultations or to avoid disturbing neighbours.',
    },
  },
  classeImmeuble: {
    terme: { fr: 'Classe d’immeuble (A, B, C)', en: 'Building class (A, B, C)' },
    definition: {
      fr: 'Classe A : immeuble récent ou rénové, hall soigné, services complets, loyer le plus élevé. Classe B : bien entretenu, plus simple. Classe C : plus ancien, le moins cher, parfois des travaux à prévoir.',
      en: 'Class A: new or renovated building, polished lobby, full services, highest rent. Class B: well kept, simpler. Class C: older, cheapest, sometimes needs work.',
    },
  },
  dealBreaker: {
    terme: { fr: 'Élément éliminatoire', en: 'Deal-breaker' },
    definition: {
      fr: 'Une caractéristique qui écarte un local d’office, même s’il coche tout le reste. On ne vous proposera jamais un local qui en contient un.',
      en: 'A feature that rules a space out, even if it ticks every other box. We will never propose a space that has one.',
    },
  },
  dureeBail: {
    terme: { fr: 'Durée du bail', en: 'Lease term' },
    definition: {
      fr: 'En commercial, les baux durent souvent 3 à 10 ans. Un bail plus long donne plus de pouvoir de négociation (mois gratuits, allocation de travaux).',
      en: 'Commercial leases often run 3 to 10 years. A longer lease gives you more bargaining power (free months, improvement allowance).',
    },
  },
} satisfies Record<string, Terme>;

export type CleLexique = keyof typeof LEXIQUE;
