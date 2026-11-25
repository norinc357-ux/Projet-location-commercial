import { describe, expect, it } from 'vitest';
import { construireFiche, ficheEnTexte } from '@/lib/formulaire/ficheRecherche';
import { validerTout } from '@/lib/formulaire/calculs';
import { DEMANDE_EXEMPLE_CAFE } from '@/lib/exemples';

describe('fiche de recherche', () => {
  const f = construireFiche(DEMANDE_EXEMPLE_CAFE);

  it("l'exemple est une demande complète et valide", () => {
    expect(validerTout(DEMANDE_EXEMPLE_CAFE)).toEqual([]);
  });
  it('sépare obligatoire, souhaitable et à écarter', () => {
    expect(f.obligatoires.length).toBeGreaterThan(2);
    expect(f.obligatoires.map((l) => l.libelle).join(' ')).toMatch(/hotte|Hotte/);
    expect(f.souhaitables.length).toBeGreaterThan(0);
    expect(f.eliminatoires.length).toBeGreaterThan(0);
  });
  it('donne des filtres prêts à saisir', () => {
    const noms = f.filtres.map((x) => x.libelle);
    expect(noms).toEqual(expect.arrayContaining(['Type', 'Secteurs', 'Superficie']));
  });
  it('prépare les questions pour les points à clarifier', () => {
    expect(f.questions.length).toBeGreaterThan(1);
    expect(f.questions.join(' ')).toMatch(/gaz/i);
  });
  it('produit une version texte à copier', () => {
    const t = ficheEnTexte(f);
    expect(t).toContain('FICHE DE RECHERCHE');
    expect(t).toContain('Boulangerie Exemple inc.');
  });
});
