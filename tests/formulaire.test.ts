import { describe, expect, it } from 'vitest';
import { ECRANS, ecransVisibles } from '@/lib/formulaire/ecrans';
import { estimerSuperficie, loyerComplet, mensuelVersPi2, neqValide, pi2VersMensuel, telephoneValide, validerChamp, validerTout, courrielValide } from '@/lib/formulaire/calculs';
import { versCriteres } from '@/lib/formulaire/criteres';
import { feriesQuebec, heureMontreal, prochainsCreneaux } from '@/lib/formulaire/creneaux';
import { AIDE, type Reponses } from '@/lib/formulaire/types';
import { afficherValeur } from '@/lib/formulaire/affichage';
import { qualifier } from '@/lib/formulaire/qualification';
import { positionBudget } from '@/lib/formulaire/calculs';

const dans = (jours: number) => new Date(Date.now() + jours * 864e5).toISOString().slice(0, 10);

/** Dossier fictif complet (EXEMPLE) : un café-boulangerie sur le Plateau. */
const restaurant: Reponses = {
  'contact.prenom': 'Exemple', 'contact.nom': 'Tremblay', 'entreprise.nom': 'Boulangerie Exemple inc.',
  'contact.courriel': 'exemple@example.com', 'contact.telephone': '514 555-0123', 'contact.mode': 'texto', 'contact.langue': 'fr',
  'entreprise.statut': 'demarrage', 'entreprise.secteur': 'restauration',
  'projet.types': ['restaurant'], 'projet.usage': 'Café-boulangerie de 30 places, cuisson sur place.', 'projet.raison': 'ouverture', 'projet.urgence': '3_6_mois',
  'projet.decideur': 'associes', 'projet.financement': 'en_cours', 'projet.visites': 'quelques',
  'emplacement.secteurs': ['plateau-mont-royal', 'mile-end'],
  'emplacement.importance': { metro: 5, stationnement: 2, visibilite: 4, achalandage: 5, camion: 1, autoroute: 1 },
  'espace.employes': 6, 'espace.employes3ans': 10, 'espace.superficie': { min: 1200, max: 1800 }, 'espace.etage': 'rdc_obligatoire',
  'restaurant.concept': 'cafe', 'restaurant.hotte': 'oui', 'restaurant.gaz': AIDE, 'restaurant.places': 30, 'restaurant.terrasse': 'souhaitable', 'restaurant.alcool': 'non', 'restaurant.equipe': 'equipe',
  'budget.loyer': { mode: 'mensuel', mensuel: 5000, pi2: null }, 'bail.type': AIDE, 'bail.duree': '5',
  'bail.dateIdeale': dans(90), 'bail.dateLimite': dans(150), 'budget.ameliorations': '25_75k', 'budget.garantie': 'a_discuter', 'budget.depot': 'oui',
  'priorites.criteres': { climatisation: 'obligatoire', terrasse: 'souhaitable' }, 'priorites.eliminatoires': ['sous_sol'],
  'rdv.creneau': 'plus_tard', 'consentement.loi25': true,
};

describe('conversions de loyer', () => {
  it('convertit mensuel ↔ $/pi²/an', () => {
    expect(mensuelVersPi2(2500, 1200)).toBe(25);
    expect(pi2VersMensuel(25, 1200)).toBe(2500);
  });
  it('utilise le milieu de la fourchette de superficie', () => {
    expect(loyerComplet({ mode: 'mensuel', mensuel: 5000, pi2: null }, { min: 1200, max: 1800 })?.pi2).toBe(40);
    expect(loyerComplet({ mode: 'pi2', mensuel: null, pi2: 30 }, { min: 1000, max: null })?.mensuel).toBe(2500);
  });
});

describe('estimation de la superficie', () => {
  it('se base sur le plus grand effectif (aujourd’hui ou dans 3 ans) et le type le plus exigeant', () => {
    const e = estimerSuperficie({ 'espace.employes': 8, 'espace.employes3ans': 12, 'projet.types': ['bureau'] });
    expect(e).toMatchObject({ personnes: 12, min: 1800, max: 2400 });
    expect(estimerSuperficie({ 'projet.types': ['bureau'] })).toBeNull();
  });
});

describe('validation', () => {
  it('formats québécois', () => {
    expect(telephoneValide('(514) 555-0123')).toBe(true);
    expect(telephoneValide('1 438 555 0123')).toBe(true);
    expect(telephoneValide('555-0123')).toBe(false);
    expect(neqValide('1171234567')).toBe(true);
    expect(neqValide('117123')).toBe(false);
    expect(courrielValide('nom@entreprise.ca')).toBe(true);
    expect(courrielValide('nom@entreprise')).toBe(false);
  });
  it('« Je ne sais pas » répond à une question technique obligatoire', () => {
    const hotte = ECRANS.find((e) => e.id === 'technique-restaurant')!.champs.find((c) => c.id === 'restaurant.hotte')!;
    expect(validerChamp(hotte, { 'projet.types': ['restaurant'] })).not.toBeNull();
    expect(validerChamp(hotte, { 'projet.types': ['restaurant'], 'restaurant.hotte': AIDE })).toBeNull();
  });
  it('la date limite doit suivre la date idéale', () => {
    const ch = ECRANS.find((e) => e.id === 'budget-dates')!.champs[1];
    expect(validerChamp(ch, { 'bail.dateIdeale': dans(60), 'bail.dateLimite': dans(30) })).not.toBeNull();
  });
  it('le consentement Loi 25 est obligatoire et non coché par défaut', () => {
    const r = { ...restaurant };
    delete r['consentement.loi25'];
    expect(validerTout(r).map((e) => e.champ)).toEqual(['consentement.loi25']);
  });
  it('un dossier complet passe sans erreur', () => {
    expect(validerTout(restaurant)).toEqual([]);
  });
});

describe('logique conditionnelle', () => {
  it('n’affiche que les écrans techniques des types choisis', () => {
    const ids = ecransVisibles(restaurant).map((e) => e.id);
    expect(ids).toContain('technique-restaurant');
    expect(ids).not.toContain('technique-industriel');
    expect(ecransVisibles({ 'projet.types': ['mixte'] }).map((e) => e.id)).toContain('technique-mixte');
    expect(ecransVisibles({ 'projet.types': ['bureau'] }).some((e) => e.etape === 5 && e.id !== 'technique-bureau')).toBe(false);
  });
  it('reste sous 10 minutes même avec tous les types', () => {
    const tous = ecransVisibles({ 'projet.types': ['bureau', 'commerce', 'restaurant', 'industriel', 'clinique', 'atelier'] });
    expect((tous.length * 18) / 60).toBeLessThan(10);
  });
});

describe('critères de jumelage', () => {
  const { criteres, aValider } = versCriteres(restaurant);
  const par = Object.fromEntries(criteres.map((c) => [c.code, c]));
  it('crée les critères éliminatoires', () => {
    expect(par.type_local).toMatchObject({ valeur: ['restaurant'], importance: 'obligatoire' });
    expect(par.rez_de_chaussee.importance).toBe('obligatoire');
    expect(par.hotte.importance).toBe('obligatoire');
    expect(par.sous_sol).toMatchObject({ operateur: 'exclut' });
    expect(par.cout_total_mensuel).toMatchObject({ operateur: 'max', valeur: 5000 });
  });
  it('pondère les critères souhaitables selon l’importance donnée', () => {
    expect(par.metro).toMatchObject({ importance: 'obligatoire', poids: 5 });
    expect(par.visibilite).toMatchObject({ importance: 'souhaitable', poids: 4 });
    expect(par.camion).toBeUndefined();
  });
  it('signale à l’agent les réponses « Aidez-moi »', () => {
    expect(aValider).toEqual(expect.arrayContaining(['restaurant.gaz', 'bail.type']));
    expect(par.entree_gaz).toBeUndefined();
  });
});

describe('créneaux de l’appel découverte', () => {
  it('connaît les fériés du Québec', () => {
    const f = feriesQuebec(2026);
    expect(f.has('2026-06-24')).toBe(true);
    expect(f.has('2026-04-03')).toBe(true); // Vendredi saint
    expect(f.has('2026-05-18')).toBe(true); // Journée nationale des patriotes
    expect(f.has('2026-10-12')).toBe(true); // Action de grâce
  });
  it('convertit l’heure de Montréal, heure normale et heure avancée', () => {
    expect(heureMontreal('2026-12-01', 9, 0)).toBe('2026-12-01T14:00:00.000Z');
    expect(heureMontreal('2026-07-02', 9, 30)).toBe('2026-07-02T13:30:00.000Z');
  });
  it('propose 5 jours ouvrables, sans fin de semaine ni jour férié', () => {
    const j = prochainsCreneaux(new Date('2026-12-23T15:00:00Z'), 5, () => true);
    expect(j.map((x) => x.jour)).toEqual(['2026-12-23', '2026-12-24', '2026-12-28', '2026-12-29', '2026-12-30']);
    expect(j[0].creneaux[0].debut).toBe('2026-12-23T17:00:00.000Z'); // 12 h : au moins 2 h d’avis
  });
});

describe('récapitulatif', () => {
  it('affiche « À valider avec votre agent » pour les réponses Aidez-moi', () => {
    const ch = ECRANS.find((e) => e.id === 'budget-bail')!.champs[0];
    expect(afficherValeur(ch, AIDE, restaurant, 'fr')).toBe('À valider avec votre agent');
  });
});

describe('ciblage par profil', () => {
  it('pose les questions sur le local actuel seulement à ceux qui en ont un', () => {
    expect(ecransVisibles({ 'projet.raison': 'demenagement' }).map((e) => e.id)).toContain('projet-situation');
    expect(ecransVisibles({ 'projet.raison': 'ouverture' }).map((e) => e.id)).not.toContain('projet-situation');
  });
  it('demande le financement aux entreprises en démarrage seulement', () => {
    const ch = ECRANS.find((e) => e.id === 'projet-decision')!.champs.find((c) => c.id === 'projet.financement')!;
    expect(validerChamp(ch, { 'entreprise.statut': 'demarrage' })).not.toBeNull();
    expect(validerChamp(ch, { 'entreprise.statut': 'existante', 'projet.raison': 'demenagement' })).toBeNull();
  });
  it('demande la radiographie seulement aux pratiques concernées', () => {
    const ch = ECRANS.find((e) => e.id === 'technique-clinique')!.champs.find((c) => c.id === 'clinique.imagerie')!;
    expect(validerChamp(ch, { 'projet.types': ['clinique'], 'clinique.pratique': 'dentaire' })).not.toBeNull();
    expect(validerChamp(ch, { 'projet.types': ['clinique'], 'clinique.pratique': 'psycho' })).toBeNull();
  });
  it('réduit la superficie de bureau en mode hybride', () => {
    const base = { 'espace.employes': 20, 'projet.types': ['bureau'] };
    expect(estimerSuperficie({ ...base, 'espace.joursBureau': '5' })).toMatchObject({ min: 3000, max: 4000, hybride: false });
    expect(estimerSuperficie({ ...base, 'espace.joursBureau': '1_2' })).toMatchObject({ min: 1950, max: 2600, hybride: true });
  });
  it('ne propose jamais plus petit que le local actuel quand on s’agrandit', () => {
    const e = estimerSuperficie({ 'espace.employes': 5, 'projet.types': ['bureau'], 'projet.raison': 'agrandissement', 'actuel.superficie': 1200 });
    expect(e!.min).toBeGreaterThan(1200);
  });
  it('traduit les précisions de profil en critères éliminatoires', () => {
    const par = (r: Reponses) => Object.fromEntries(versCriteres(r).criteres.map((c) => [c.code, c]));
    expect(par({ 'projet.types': ['atelier'], 'atelier.activite': 'mecanique' }).zonage_garage.importance).toBe('obligatoire');
    expect(par({ 'projet.types': ['industriel'], 'industriel.temperature': 'froid', 'industriel.matieres': 'oui' })).toHaveProperty('temperature_froid');
    expect(par({ 'projet.types': ['commerce'], 'commerce.emplacement': 'rue' }).type_emplacement.valeur).toBe('rue');
  });
});

describe('repère de marché et qualification', () => {
  it('situe le budget dans la fourchette du type de local', () => {
    expect(positionBudget(restaurant)).toMatchObject({ pi2: 40, position: 'dans' });
    expect(positionBudget({ ...restaurant, 'budget.loyer': { mode: 'pi2', pi2: 18, mensuel: null } })?.position).toBe('sous');
  });
  it('donne un score de 0 à 100 avec des drapeaux pour l’agent', () => {
    const q = qualifier(restaurant);
    expect(q.score).toBeGreaterThan(40);
    expect(q.score).toBeLessThanOrEqual(100);
    expect(q.drapeaux).toContain('decision_en_equipe');
    const faible = qualifier({ ...restaurant, 'budget.loyer': { mode: 'pi2', pi2: 12, mensuel: null }, 'projet.urgence': 'exploration', 'projet.financement': 'pas_encore' });
    expect(faible.score).toBeLessThan(q.score);
    expect(faible.drapeaux).toEqual(expect.arrayContaining(['budget_sous_marche', 'financement_pas_encore']));
  });
});
