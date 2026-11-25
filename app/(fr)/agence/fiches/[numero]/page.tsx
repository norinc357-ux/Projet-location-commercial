import { notFound } from 'next/navigation';
import Link from 'next/link';
import { depot } from '@/lib/serveur/depot';
import { construireFiche } from '@/lib/formulaire/ficheRecherche';
import { FicheRecherche } from '@/components/agence/FicheRecherche';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const d = await depot.parNumero(numero);
  if (!d) notFound();
  return (
    <>
      <p className="bascule-vues"><Link href="/agence/fiches">← Toutes les demandes</Link></p>
      <FicheRecherche fiche={construireFiche(d.reponses)} numero={numero} />
    </>
  );
}
