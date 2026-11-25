import { NextResponse } from 'next/server';
import { depot } from '@/lib/serveur/depot';

type Ctx = { params: Promise<{ jeton: string }> };
const jetonValide = (j: string) => /^[0-9a-f-]{32,36}$/i.test(j);

export async function GET(_req: Request, { params }: Ctx) {
  const { jeton } = await params;
  if (!jetonValide(jeton)) return NextResponse.json({ erreur: 'jeton' }, { status: 400 });
  const d = await depot.obtenir(jeton);
  if (!d || d.statut !== 'brouillon') return NextResponse.json({ erreur: 'introuvable' }, { status: 404 });
  return NextResponse.json({ jeton: d.jeton, reponses: d.reponses, ecran: d.ecran, misAJour: d.misAJour });
}

export async function PUT(req: Request, { params }: Ctx) {
  const { jeton } = await params;
  if (!jetonValide(jeton)) return NextResponse.json({ erreur: 'jeton' }, { status: 400 });
  const corps = await req.json().catch(() => null);
  if (!corps || typeof corps.reponses !== 'object' || JSON.stringify(corps.reponses).length > 200_000)
    return NextResponse.json({ erreur: 'corps' }, { status: 400 });
  const d = await depot.enregistrerBrouillon(jeton, corps.reponses, String(corps.ecran ?? ''));
  return NextResponse.json({ misAJour: d.misAJour });
}
