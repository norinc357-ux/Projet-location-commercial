import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protège /agence : renseignements personnels (Loi 25).
 * Accès par mot de passe (variable AGENCE_MOT_DE_PASSE). Sans variable, l'accès est refusé.
 * À l'étape 5, remplacé par de vrais comptes agents avec rôles.
 */
export function middleware(req: NextRequest) {
  const attendu = process.env.AGENCE_MOT_DE_PASSE;
  const entete = req.headers.get('authorization') ?? '';
  if (attendu && entete.startsWith('Basic ')) {
    const [, mdp] = atob(entete.slice(6)).split(':');
    if (mdp === attendu) return NextResponse.next();
  }
  return new NextResponse(attendu ? 'Accès réservé à l’agence.' : 'Accès agence désactivé : définissez AGENCE_MOT_DE_PASSE.', {
    status: 401,
    headers: attendu ? { 'WWW-Authenticate': 'Basic realm="Agence", charset="UTF-8"' } : {},
  });
}

export const config = { matcher: ['/agence/:path*'] };
