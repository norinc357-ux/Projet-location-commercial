import type { T } from '@/lib/formulaire/i18n';
import type { TypeLocal } from '@/lib/formulaire/types';
import type { CleLexique } from '@/lib/formulaire/lexique';

/** Contenu des pages « Types de locaux ». Une page par type, optimisée pour la recherche locale. */
export type ContenuType = {
  titre: T;            // H1
  metaDescription: T;
  accroche: T;         // phrase sous le titre
  pourQui: T;
  points: { titre: T; texte: T }[];  // points à vérifier
  pieges: T[];         // erreurs fréquentes
  delai: T;            // délai typique jusqu'aux clés
  termes: CleLexique[];
};

export const CONTENU_TYPES: Record<TypeLocal, ContenuType> = {
  bureau: {
    titre: { fr: 'Location de bureaux à Montréal', en: 'Office space for lease in Montréal' },
    metaDescription: {
      fr: 'Bureaux à louer à Montréal : on trouve, on visite et on négocie pour vous. Points à vérifier, superficie par employé, classes d’immeubles.',
      en: 'Office space for lease in Montréal: we find, tour and negotiate for you. What to check, space per employee, building classes.',
    },
    accroche: {
      fr: 'Un bureau qui aide votre équipe à venir travailler, au bon prix, sans y passer vos soirées.',
      en: 'An office your team actually wants to come to, at the right price, without spending your evenings on it.',
    },
    pourQui: {
      fr: 'PME qui déménage ou s’agrandit, professionnels (comptables, avocats, agences), sièges sociaux et équipes en mode hybride.',
      en: 'Growing or relocating SMBs, professionals (accountants, lawyers, agencies), head offices and hybrid teams.',
    },
    points: [
      { titre: { fr: 'La bonne superficie', en: 'The right size' }, texte: { fr: 'Comptez 150 à 250 pi² par personne, moins si votre équipe est en mode hybride. On calcule avec vous à partir de vos effectifs dans 3 ans, pas d’aujourd’hui.', en: 'Plan 150 to 250 sq. ft. per person, less for hybrid teams. We size it with you based on headcount three years out, not today.' } },
      { titre: { fr: 'Le coût total, pas le loyer affiché', en: 'Total cost, not the asking rent' }, texte: { fr: 'Au centre-ville, les frais d’exploitation et les taxes foncières peuvent ajouter 15 à 25 $ le pi² par année au loyer de base. On vous montre toujours le coût mensuel tout compris.', en: 'Downtown, operating costs and property taxes can add $15 to $25 per sq. ft. per year to base rent. We always show you the all-in monthly cost.' } },
      { titre: { fr: 'La classe de l’immeuble', en: 'Building class' }, texte: { fr: 'Classe A, B ou C : hall, ascenseurs, CVAC, services. Une classe B bien située donne souvent le meilleur rapport qualité-prix.', en: 'Class A, B or C: lobby, elevators, HVAC, services. A well-located Class B building is often the best value.' } },
      { titre: { fr: 'L’aménagement', en: 'Fit-out' }, texte: { fr: 'Aire ouverte, bureaux fermés, salles de réunion : un local déjà aménagé peut vous faire économiser des mois et des dizaines de milliers de dollars.', en: 'Open plan, private offices, meeting rooms: a space already built out can save you months and tens of thousands of dollars.' } },
      { titre: { fr: 'Accès et transport', en: 'Access and transit' }, texte: { fr: 'Métro, REM, stationnement, vélo : l’emplacement est un argument de recrutement.', en: 'Metro, REM, parking, bike storage: location is a recruiting argument.' } },
      { titre: { fr: 'Accès 24/7 et sécurité', en: '24/7 access and security' }, texte: { fr: 'Cartes d’accès, heures de CVAC hors des heures normales (souvent facturées en plus) et gardiennage.', en: 'Access cards, after-hours HVAC (often billed extra) and security staff.' } },
    ],
    pieges: [
      { fr: 'Signer pour la superficie d’aujourd’hui et devoir redéménager dans deux ans.', en: 'Signing for today’s headcount and having to move again in two years.' },
      { fr: 'Oublier la clause de restauration : remettre le local à l’état d’origine à la fin du bail peut coûter cher.', en: 'Overlooking the restoration clause: returning the space to its original state at lease end can be costly.' },
      { fr: 'Comparer des loyers bruts et nets comme s’ils étaient pareils.', en: 'Comparing gross and net rents as if they were the same.' },
    ],
    delai: { fr: 'Souvent 2 à 4 mois entre la première sélection et l’emménagement, plus si des travaux sont nécessaires.', en: 'Often 2 to 4 months from first shortlist to move-in, longer if work is needed.' },
    termes: ['classeImmeuble', 'bailNet', 'fraisExploitation', 'ameliorationsLocatives'],
  },
  commerce: {
    titre: { fr: 'Local commercial à louer à Montréal', en: 'Retail space for lease in Montréal' },
    metaDescription: {
      fr: 'Boutique, vitrine sur rue, local commercial à louer à Montréal : achalandage, enseigne, zonage. On cherche et on négocie pour vous.',
      en: 'Storefronts and retail space for lease in Montréal: foot traffic, signage, zoning. We search and negotiate for you.',
    },
    accroche: {
      fr: 'La bonne vitrine, sur la bonne rue, devant les bons passants.',
      en: 'The right storefront, on the right street, in front of the right people.',
    },
    pourQui: {
      fr: 'Commerçants qui ouvrent une première boutique, détaillants qui ajoutent une succursale, marques qui testent un quartier.',
      en: 'First-time shop owners, retailers adding a location, brands testing a neighbourhood.',
    },
    points: [
      { titre: { fr: 'L’achalandage réel', en: 'Real foot traffic' }, texte: { fr: 'On regarde qui passe, à quelle heure et de quel côté de la rue. Deux adresses sur la même artère peuvent avoir un achalandage très différent.', en: 'We look at who walks by, when, and on which side of the street. Two addresses on the same strip can see very different traffic.' } },
      { titre: { fr: 'La vitrine et l’enseigne', en: 'Frontage and signage' }, texte: { fr: 'Largeur de la façade, visibilité depuis le trottoir et ce que l’arrondissement permet comme enseigne.', en: 'Frontage width, visibility from the sidewalk and what the borough allows for signage.' } },
      { titre: { fr: 'Le zonage', en: 'Zoning' }, texte: { fr: 'Chaque arrondissement fixe les usages permis. On vérifie que votre activité est autorisée avant toute offre.', en: 'Each borough sets the permitted uses. We confirm your activity is allowed before any offer.' } },
      { titre: { fr: 'Les frais d’exploitation', en: 'Operating costs' }, texte: { fr: 'En centre commercial, les frais communs et le marketing peuvent peser lourd. On les chiffre avant la visite.', en: 'In shopping centres, common costs and marketing fees can be heavy. We quantify them before the tour.' } },
      { titre: { fr: 'L’entreposage', en: 'Storage' }, texte: { fr: 'Arrière-boutique, sous-sol, accès pour les livraisons : souvent oublié jusqu’au premier arrivage.', en: 'Back room, basement, delivery access: often forgotten until the first shipment arrives.' } },
      { titre: { fr: 'Les clauses d’exclusivité', en: 'Exclusivity clauses' }, texte: { fr: 'Dans un centre ou une rangée de commerces, une clause peut empêcher le propriétaire de louer à un concurrent direct.', en: 'In a centre or strip, a clause can stop the landlord from leasing to a direct competitor.' } },
    ],
    pieges: [
      { fr: 'Choisir un loyer bas dans une rue sans passage : l’économie part en publicité.', en: 'Picking cheap rent on a street with no traffic: the savings go into advertising.' },
      { fr: 'Signer avant de savoir si l’enseigne voulue est permise.', en: 'Signing before knowing whether the sign you want is allowed.' },
      { fr: 'Accepter une clause de pourcentage des ventes sans la comprendre.', en: 'Accepting a percentage-rent clause without understanding it.' },
    ],
    delai: { fr: 'Souvent 1 à 3 mois jusqu’à la signature, puis le temps des travaux d’aménagement.', en: 'Often 1 to 3 months to signing, then the time needed for fit-out.' },
    termes: ['achalandage', 'zonage', 'bailNet', 'ameliorationsLocatives'],
  },
  restaurant: {
    titre: { fr: 'Local pour restaurant ou café à louer à Montréal', en: 'Restaurant and café space for lease in Montréal' },
    metaDescription: {
      fr: 'Local de restaurant ou café à louer à Montréal : hotte, gaz, permis d’alcool, ancien restaurant équipé. On vérifie tout avant la visite.',
      en: 'Restaurant and café space for lease in Montréal: hood, gas, liquor permit, former restaurants with equipment. We check everything before the tour.',
    },
    accroche: {
      fr: 'Hotte, gaz, permis, achalandage : on vérifie la technique avant que vous tombiez en amour avec un local.',
      en: 'Hood, gas, permits, foot traffic: we check the technical side before you fall for a space.',
    },
    pourQui: {
      fr: 'Restaurateurs, cafés, boulangeries, bars, traiteurs et comptoirs, qu’il s’agisse d’une première adresse ou d’une nouvelle succursale.',
      en: 'Restaurants, cafés, bakeries, bars, caterers and counters, whether a first location or a new branch.',
    },
    points: [
      { titre: { fr: 'La hotte et l’extraction', en: 'Hood and exhaust' }, texte: { fr: 'Une hotte commerciale avec conduit jusqu’au toit coûte souvent plus de 40 000 $ à installer. Un local qui en a déjà une vaut beaucoup.', en: 'A commercial hood with a duct to the roof often costs over $40,000 to install. A space that already has one is worth a lot.' } },
      { titre: { fr: 'Le gaz et l’électricité', en: 'Gas and electrical' }, texte: { fr: 'Entrée de gaz, capacité électrique, chauffe-eau : on demande les plans et les factures avant la visite.', en: 'Gas line, electrical capacity, water heater: we ask for plans and bills before the tour.' } },
      { titre: { fr: 'Le zonage et les permis', en: 'Zoning and permits' }, texte: { fr: 'Restauration permise, permis d’alcool de la Régie, terrasse sur le domaine public : chaque étape a ses délais.', en: 'Restaurant use allowed, Régie liquor permit, sidewalk patio: each step has its own timeline.' } },
      { titre: { fr: 'Ancien restaurant ou local vide', en: 'Former restaurant or empty space' }, texte: { fr: 'Un ancien restaurant peut faire gagner des mois. On vérifie l’état et la propriété des équipements, et s’il y a un « pas de porte » à payer.', en: 'A former restaurant can save months. We check the condition and ownership of equipment, and whether there is a key money payment.' } },
      { titre: { fr: 'Les voisins', en: 'Neighbours' }, texte: { fr: 'Odeurs, bruit, heures d’ouverture : les logements au-dessus peuvent limiter votre exploitation.', en: 'Smells, noise, opening hours: apartments upstairs can limit how you operate.' } },
      { titre: { fr: 'Les places et la terrasse', en: 'Seating and patio' }, texte: { fr: 'Le nombre de places dépend de la superficie, des sorties et des toilettes exigées. On fait le calcul tôt.', en: 'Seat count depends on floor area, exits and required washrooms. We run the numbers early.' } },
    ],
    pieges: [
      { fr: 'Signer pour un local sans hotte en pensant l’ajouter facilement.', en: 'Signing for a space with no hood thinking you can easily add one.' },
      { fr: 'Payer des équipements qui appartiennent en fait au propriétaire.', en: 'Paying for equipment that actually belongs to the landlord.' },
      { fr: 'Sous-estimer le délai du permis d’alcool et ouvrir sans.', en: 'Underestimating the liquor permit timeline and opening without one.' },
    ],
    delai: { fr: 'Souvent 2 à 4 mois jusqu’à la signature, puis 2 à 6 mois de travaux et de permis avant l’ouverture.', en: 'Often 2 to 4 months to signing, then 2 to 6 months of work and permits before opening.' },
    termes: ['hotte', 'permisAlcool', 'zonage', 'ameliorationsLocatives'],
  },
  industriel: {
    titre: { fr: 'Entrepôt et local industriel à louer à Montréal', en: 'Industrial and warehouse space for lease in Montréal' },
    metaDescription: {
      fr: 'Entrepôt, local industriel ou logistique à louer dans le Grand Montréal : hauteur libre, quais, 600 V, charge au plancher. Recherche et négociation clé en main.',
      en: 'Warehouse, industrial and logistics space for lease in Greater Montréal: clear height, docks, 600 V, floor load. Turnkey search and negotiation.',
    },
    accroche: {
      fr: 'Hauteur libre, quais, ampérage : des critères précis, une recherche précise.',
      en: 'Clear height, docks, power: precise criteria, a precise search.',
    },
    pourQui: {
      fr: 'Distributeurs, entreprises de logistique, fabricants, transformateurs alimentaires et entrepreneurs spécialisés.',
      en: 'Distributors, logistics companies, manufacturers, food processors and specialized contractors.',
    },
    points: [
      { titre: { fr: 'La hauteur libre', en: 'Clear height' }, texte: { fr: 'Mesurée sous les poutres ou les gicleurs, pas au plafond. Elle détermine combien de palettes vous pouvez empiler.', en: 'Measured under the beams or sprinklers, not to the ceiling. It decides how high you can stack pallets.' } },
      { titre: { fr: 'Quais et portes au sol', en: 'Dock and drive-in doors' }, texte: { fr: 'Nombre, hauteur, niveleurs, espace de manœuvre pour les 53 pieds.', en: 'Number, height, levellers, room to manoeuvre 53-foot trailers.' } },
      { titre: { fr: 'L’électricité', en: 'Power' }, texte: { fr: 'Ampérage, 600 V, triphasé : une mise à niveau peut coûter cher et prendre des mois avec Hydro-Québec.', en: 'Amperage, 600 V, three-phase: an upgrade can be costly and take months with Hydro-Québec.' } },
      { titre: { fr: 'La charge au plancher', en: 'Floor load' }, texte: { fr: 'Essentielle pour la machinerie lourde et l’entreposage en hauteur.', en: 'Essential for heavy machinery and high-bay storage.' } },
      { titre: { fr: 'Le zonage', en: 'Zoning' }, texte: { fr: 'Fabrication, entreposage, matières dangereuses, entreposage extérieur : tout n’est pas permis partout.', en: 'Manufacturing, storage, hazardous materials, outdoor storage: not everything is allowed everywhere.' } },
      { titre: { fr: 'L’accès routier', en: 'Road access' }, texte: { fr: 'Distance de l’autoroute 40, 13, 20 ou 25, du port et des clients : chaque minute compte pour vos camions.', en: 'Distance to Highways 40, 13, 20 or 25, the port and customers: every minute counts for your trucks.' } },
    ],
    pieges: [
      { fr: 'Confondre hauteur au plafond et hauteur libre.', en: 'Confusing ceiling height with clear height.' },
      { fr: 'Découvrir après la signature que l’électricité ne suffit pas.', en: 'Discovering after signing that the power is not enough.' },
      { fr: 'Oublier les gicleurs exigés pour l’entreposage en hauteur.', en: 'Forgetting the sprinklers required for high-bay storage.' },
    ],
    delai: { fr: 'Le marché est serré : comptez 3 à 6 mois, plus pour les grands espaces. Commencez tôt.', en: 'The market is tight: plan 3 to 6 months, longer for large spaces. Start early.' },
    termes: ['hauteurLibre', 'quai', 'electricite600', 'chargePlancher', 'bailTripleNet'],
  },
  clinique: {
    titre: { fr: 'Local pour clinique à louer à Montréal', en: 'Clinic space for lease in Montréal' },
    metaDescription: {
      fr: 'Local pour clinique médicale, dentaire, physiothérapie ou psychologie à Montréal : plomberie, insonorisation, accessibilité universelle.',
      en: 'Space for medical, dental, physio or therapy clinics in Montréal: plumbing, soundproofing, universal accessibility.',
    },
    accroche: {
      fr: 'Plomberie, insonorisation, accessibilité : un local qui rassure vos patients dès la porte d’entrée.',
      en: 'Plumbing, soundproofing, accessibility: a space that reassures patients from the front door.',
    },
    pourQui: {
      fr: 'Médecins, dentistes, physiothérapeutes, psychologues, optométristes et cliniques multidisciplinaires.',
      en: 'Physicians, dentists, physiotherapists, psychologists, optometrists and multidisciplinary clinics.',
    },
    points: [
      { titre: { fr: 'La plomberie', en: 'Plumbing' }, texte: { fr: 'Un lavabo par salle, parfois plus : ajouter de la plomberie dans une dalle de béton coûte cher. On vérifie l’existant.', en: 'A sink in every room, sometimes more: adding plumbing in a concrete slab is expensive. We check what is there.' } },
      { titre: { fr: 'L’insonorisation', en: 'Soundproofing' }, texte: { fr: 'La confidentialité des patients passe par des murs qui montent jusqu’à la dalle et des portes pleines.', en: 'Patient privacy depends on walls built to the slab and solid-core doors.' } },
      { titre: { fr: 'L’accessibilité universelle', en: 'Universal accessibility' }, texte: { fr: 'Entrée de plain-pied ou rampe, ascenseur, toilettes adaptées : indispensable pour vos patients.', en: 'Step-free entrance or ramp, elevator, accessible washroom: essential for your patients.' } },
      { titre: { fr: 'Le stationnement', en: 'Parking' }, texte: { fr: 'Places pour les patients, débarcadère, proximité du transport en commun.', en: 'Patient parking, drop-off area, transit nearby.' } },
      { titre: { fr: 'Les équipements spéciaux', en: 'Special equipment' }, texte: { fr: 'Imagerie, fauteuils dentaires, stérilisation : blindage, électricité et ventilation à prévoir.', en: 'Imaging, dental chairs, sterilization: shielding, power and ventilation to plan for.' } },
      { titre: { fr: 'Le zonage', en: 'Zoning' }, texte: { fr: 'Certains secteurs limitent les usages de santé au rez-de-chaussée ou à l’étage. On vérifie avant l’offre.', en: 'Some areas restrict health uses on the ground floor or upstairs. We check before the offer.' } },
    ],
    pieges: [
      { fr: 'Sous-estimer le coût d’ajouter de la plomberie dans chaque salle.', en: 'Underestimating the cost of adding plumbing to every room.' },
      { fr: 'Choisir un étage sans ascenseur pour une clientèle âgée.', en: 'Choosing an upper floor with no elevator for older patients.' },
      { fr: 'Oublier les exigences de votre ordre professionnel.', en: 'Forgetting your professional order’s requirements.' },
    ],
    delai: { fr: 'Souvent 2 à 4 mois jusqu’à la signature, puis 2 à 4 mois d’aménagement.', en: 'Often 2 to 4 months to signing, then 2 to 4 months of fit-out.' },
    termes: ['insonorisation', 'accessibiliteUniverselle', 'ameliorationsLocatives', 'zonage'],
  },
  atelier: {
    titre: { fr: 'Atelier à louer à Montréal', en: 'Workshop space for lease in Montréal' },
    metaDescription: {
      fr: 'Atelier à louer à Montréal pour artisans, ébénistes, mécaniciens, studios : ventilation, bruit, électricité et accès camion.',
      en: 'Workshop space for lease in Montréal for makers, woodworkers, mechanics and studios: ventilation, noise, power and truck access.',
    },
    accroche: {
      fr: 'Un espace pour fabriquer, réparer ou créer, sans problème avec les voisins.',
      en: 'A space to make, repair or create, without trouble with the neighbours.',
    },
    pourQui: {
      fr: 'Artisans, ébénistes, garages, studios de création, petites productions et métiers de la construction.',
      en: 'Makers, woodworkers, garages, creative studios, small production and construction trades.',
    },
    points: [
      { titre: { fr: 'La ventilation', en: 'Ventilation' }, texte: { fr: 'Poussière, vapeurs, peinture : un système d’évacuation adapté est souvent obligatoire.', en: 'Dust, fumes, paint: a proper exhaust system is often required.' } },
      { titre: { fr: 'Le bruit', en: 'Noise' }, texte: { fr: 'On vérifie qui sont les voisins et ce que le bail permet comme heures de travail.', en: 'We check who the neighbours are and what working hours the lease allows.' } },
      { titre: { fr: 'L’électricité', en: 'Power' }, texte: { fr: 'Outils et machines demandent souvent du 220 V ou du triphasé.', en: 'Tools and machines often need 220 V or three-phase power.' } },
      { titre: { fr: 'L’accès', en: 'Access' }, texte: { fr: 'Porte de garage, accès camion, monte-charge : pour vos matériaux et vos livraisons.', en: 'Overhead door, truck access, freight elevator: for materials and deliveries.' } },
      { titre: { fr: 'Le zonage', en: 'Zoning' }, texte: { fr: 'Un garage ou un atelier de production n’est pas permis dans tous les secteurs.', en: 'A garage or production workshop is not allowed in every area.' } },
      { titre: { fr: 'L’assurance', en: 'Insurance' }, texte: { fr: 'Certaines activités exigent des protections particulières : on en parle avant l’offre.', en: 'Some activities require specific coverage: we discuss it before the offer.' } },
    ],
    pieges: [
      { fr: 'Louer dans un immeuble mixte où le bruit deviendra un conflit.', en: 'Leasing in a mixed building where noise will become a conflict.' },
      { fr: 'Ne pas vérifier la capacité électrique avant d’installer les machines.', en: 'Not checking electrical capacity before installing machines.' },
    ],
    delai: { fr: 'Souvent 1 à 3 mois jusqu’à la signature.', en: 'Often 1 to 3 months to signing.' },
    termes: ['zonage', 'electricite600', 'quai'],
  },
  mixte: {
    titre: { fr: 'Local à usage mixte à louer à Montréal', en: 'Mixed-use space for lease in Montréal' },
    metaDescription: {
      fr: 'Local mixte à Montréal : boutique et atelier, bureau et entrepôt, salle de montre. On trouve l’espace qui combine vos usages.',
      en: 'Mixed-use space in Montréal: shop and workshop, office and warehouse, showroom. We find the space that combines your uses.',
    },
    accroche: {
      fr: 'Vente, bureau, production ou entreposage sous un même toit.',
      en: 'Sales, office, production or storage under one roof.',
    },
    pourQui: {
      fr: 'Entreprises qui combinent plusieurs activités : salle de montre et entrepôt, boutique et atelier, bureau et laboratoire.',
      en: 'Businesses that combine activities: showroom and warehouse, shop and workshop, office and lab.',
    },
    points: [
      { titre: { fr: 'Le zonage de chaque usage', en: 'Zoning for each use' }, texte: { fr: 'Chacun de vos usages doit être permis à cette adresse. C’est le premier point qu’on vérifie.', en: 'Each of your uses must be allowed at the address. It is the first thing we check.' } },
      { titre: { fr: 'La répartition des espaces', en: 'Space split' }, texte: { fr: 'Quelle part pour la vente, le bureau, la production ? On estime chaque zone séparément.', en: 'How much for sales, office, production? We size each zone separately.' } },
      { titre: { fr: 'Les accès séparés', en: 'Separate access' }, texte: { fr: 'Une entrée pour les clients, une autre pour les livraisons.', en: 'One entrance for customers, another for deliveries.' } },
      { titre: { fr: 'Le loyer pondéré', en: 'Blended rent' }, texte: { fr: 'Certains propriétaires appliquent un loyer différent à la partie bureau et à la partie entrepôt.', en: 'Some landlords charge a different rate for the office part and the warehouse part.' } },
    ],
    pieges: [
      { fr: 'Supposer que tous les usages sont permis parce que le locataire précédent les avait.', en: 'Assuming all uses are allowed because the previous tenant had them.' },
    ],
    delai: { fr: 'Variable selon la combinaison : souvent 2 à 4 mois.', en: 'Depends on the mix: often 2 to 4 months.' },
    termes: ['zonage', 'bailNet', 'ameliorationsLocatives'],
  },
};
