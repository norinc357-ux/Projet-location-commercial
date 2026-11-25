import { NextResponse } from 'next/server';
import { depot } from '@/lib/serveur/depot';
import { validerTout } from '@/lib/formulaire/calculs';
import { versCriteres } from '@/lib/formulaire/criteres';

type Ctx = { params: Promise<{ jeton: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { jeton } = await params;
  const corps = await req.json().catch(() => null);
  const reponses = corps?.reponses;
  if (!reponses || typeof reponses !== 'object') return NextResponse.json({ erreur: 'corps' }, { status: 400 });
  // Mêmes règles que dans le navigateur.
  const erreurs = validerTout(reponses);
  if (erreurs.length) return NextResponse.json({ erreur: 'validation', erreurs }, { status: 422 });
  const { criteres, aValider } = versCriteres(reponses);
  const d = await depot.soumettre(jeton, reponses, criteres, aValider);
  // Étape 6 : courriel de confirmation + PDF, fiche client, score de qualification, alerte à l'agent, relance 24 h.
  return NextResponse.json({ numero: d.dossier!.numero });
}
