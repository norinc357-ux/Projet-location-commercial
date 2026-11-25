/** Données d'EXEMPLE (fictives), clairement identifiées. Servent à la démo et aux tests. */
import type { Reponses } from './formulaire/types';

const dans = (jours: number) => new Date(Date.now() + jours * 864e5).toISOString().slice(0, 10);

export const DEMANDE_EXEMPLE_CAFE: Reponses = {
  'contact.prenom': 'Exemple', 'contact.nom': 'Tremblay', 'entreprise.nom': 'Boulangerie Exemple inc.',
  'contact.courriel': 'exemple@example.com', 'contact.telephone': '514 555-0123', 'contact.mode': 'texto', 'contact.langue': 'fr',
  'entreprise.statut': 'demarrage', 'entreprise.secteur': 'restauration',
  'projet.types': ['restaurant'], 'projet.usage': 'Café-boulangerie de 30 places, cuisson sur place, vente à emporter.', 'projet.raison': 'ouverture', 'projet.urgence': '3_6_mois',
  'projet.decideur': 'associes', 'projet.financement': 'en_cours', 'projet.visites': 'quelques',
  'emplacement.secteurs': ['plateau-mont-royal', 'mile-end'],
  'emplacement.importance': { metro: 5, stationnement: 2, visibilite: 4, achalandage: 5, camion: 1, autoroute: 1 },
  'espace.employes': 6, 'espace.employes3ans': 10, 'espace.superficie': { min: 1200, max: 1800 }, 'espace.etage': 'rdc_obligatoire',
  'restaurant.concept': 'cafe', 'restaurant.hotte': 'oui', 'restaurant.gaz': 'aide', 'restaurant.places': 30, 'restaurant.terrasse': 'souhaitable', 'restaurant.alcool': 'non', 'restaurant.equipe': 'equipe',
  'budget.loyer': { mode: 'mensuel', mensuel: 5000, pi2: null }, 'bail.type': 'aide', 'bail.duree': '5',
  'bail.dateIdeale': dans(90), 'bail.dateLimite': dans(150), 'budget.ameliorations': '25_75k', 'budget.garantie': 'a_discuter', 'budget.depot': 'oui',
  'priorites.criteres': { climatisation: 'obligatoire', terrasse: 'souhaitable', lumiere_naturelle: 'souhaitable' }, 'priorites.eliminatoires': ['sous_sol'],
  'mots.description': 'Lumineux, une grande vitrine sur une rue animée, du bois et des plantes. On voit le four en entrant.',
  'rdv.creneau': 'plus_tard', 'consentement.loi25': true,
};
