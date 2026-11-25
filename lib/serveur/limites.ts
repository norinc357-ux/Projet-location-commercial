/** Limite simple en mémoire (développement). En production : Redis ou table dédiée. */
const compteurs = new Map<string, number[]>();
export function autoriser(cle: string, max: number, fenetreMs: number): boolean {
  const maintenant = Date.now();
  const liste = (compteurs.get(cle) ?? []).filter((t) => maintenant - t < fenetreMs);
  if (liste.length >= max) return false;
  liste.push(maintenant);
  compteurs.set(cle, liste);
  return true;
}
