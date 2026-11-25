import { NextResponse } from 'next/server';
import { validerContact } from '@/lib/site/contact';
import { autoriser } from '@/lib/serveur/limites';
import { expediteur } from '@/lib/serveur/courriel';
import { AGENCE } from '@/lib/config';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'inconnu';
  if (!autoriser(`contact:${ip}`, 5, 3600_000)) return NextResponse.json({ erreur: 'trop' }, { status: 429 });
  const d = await req.json().catch(() => null);
  if (!d || typeof d !== 'object') return NextResponse.json({ erreur: 'format' }, { status: 400 });
  if (d.site) return NextResponse.json({ ok: true }); // robot : on fait semblant
  const langue = d.langue === 'en' ? 'en' : 'fr';
  const erreurs = validerContact(d, langue);
  if (Object.keys(erreurs).length) return NextResponse.json({ erreurs }, { status: 422 });
  await expediteur.envoyer({
    a: AGENCE.courriel,
    sujet: `Message du site : ${String(d.nom).slice(0, 80)}`,
    texte: `De : ${d.nom} <${d.courriel}>${d.telephone ? `\nTéléphone : ${d.telephone}` : ''}\nLangue : ${langue}\n\n${d.message}`,
  });
  return NextResponse.json({ ok: true });
}
