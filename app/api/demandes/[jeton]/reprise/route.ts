import { NextResponse } from 'next/server';
import { depot } from '@/lib/serveur/depot';
import { courrielReprise, expediteur } from '@/lib/serveur/courriel';
import { autoriser } from '@/lib/serveur/limites';
import { courrielValide } from '@/lib/formulaire/calculs';

type Ctx = { params: Promise<{ jeton: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { jeton } = await params;
  const corps = await req.json().catch(() => null);
  const courriel = String(corps?.courriel ?? '');
  const langue = corps?.langue === 'en' ? 'en' : 'fr';
  if (!courrielValide(courriel)) return NextResponse.json({ erreur: 'courriel' }, { status: 400 });
  if (!autoriser(`reprise:${jeton}`, 3, 3600e3)) return NextResponse.json({ erreur: 'limite' }, { status: 429 });
  const d = await depot.obtenir(jeton);
  if (!d || d.statut !== 'brouillon') return NextResponse.json({ erreur: 'introuvable' }, { status: 404 });
  // Le lien est construit côté serveur : jamais à partir d'une URL fournie par le navigateur.
  const origine = new URL(req.url).origin;
  const chemin = langue === 'fr' ? '/decrire-mon-projet' : '/en/describe-my-project';
  const lien = `${origine}${chemin}?reprise=${encodeURIComponent(jeton)}`;
  await expediteur.envoyer({ a: courriel, ...courrielReprise(langue, String(d.reponses['contact.prenom'] ?? ''), lien) });
  return NextResponse.json({ envoye: true });
}
