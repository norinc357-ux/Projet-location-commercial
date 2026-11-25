'use client';

import { createContext, useContext, type AnchorHTMLAttributes } from 'react';

/**
 * Lien interne. Sur le site, un simple <a>. Dans la démo autonome (un seul fichier HTML),
 * le fournisseur transforme l'adresse en ancre « #/… » pour naviguer sans serveur.
 */
const Transformer = createContext<(href: string) => string>((h) => h);
export const FournisseurLiens = Transformer.Provider;

export function Lien({ href, ...reste }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const transformer = useContext(Transformer);
  const interne = href.startsWith('/');
  return <a href={interne ? transformer(href) : href} {...reste} />;
}
