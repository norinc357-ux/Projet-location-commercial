/**
 * Dépôt des demandes — implémentation fichier JSON pour le développement.
 * À l'étape 4, remplacé par PostgreSQL (tables `demande`, `dossier`, `critere`) sans changer l'interface.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Reponses } from '@/lib/formulaire/types';
import type { Critere } from '@/lib/formulaire/criteres';
import type { Qualification } from '@/lib/formulaire/qualification';

export type DemandeStockee = {
  jeton: string;
  statut: 'brouillon' | 'soumise';
  ecran: string;
  reponses: Reponses;
  creeLe: string;
  misAJour: string;
  soumiseLe?: string;
  dossier?: { numero: string; etape: 'DEMANDE_RECUE'; criteres: Critere[]; aValider: string[]; qualification: Qualification };
};

const FICHIER = path.join(process.cwd(), '.data', 'demandes.json');
let file: Promise<unknown> = Promise.resolve(); // sérialise les écritures

async function lire(): Promise<Record<string, DemandeStockee>> {
  try {
    return JSON.parse(await fs.readFile(FICHIER, 'utf8'));
  } catch {
    return {};
  }
}
async function ecrire(tout: Record<string, DemandeStockee>) {
  await fs.mkdir(path.dirname(FICHIER), { recursive: true });
  await fs.writeFile(FICHIER, JSON.stringify(tout, null, 2));
}
function enSerie<R>(f: () => Promise<R>): Promise<R> {
  const p = file.then(f, f);
  file = p.catch(() => undefined);
  return p;
}

export const depot = {
  obtenir: async (jeton: string) => (await lire())[jeton] ?? null,
  /** Demandes soumises, les plus prioritaires d'abord (vue agence). */
  listerSoumises: async () =>
    Object.values(await lire())
      .filter((d) => d.dossier)
      .sort((a, b) => b.dossier!.qualification.score - a.dossier!.qualification.score || (b.soumiseLe ?? '').localeCompare(a.soumiseLe ?? '')),
  parNumero: async (numero: string) => Object.values(await lire()).find((d) => d.dossier?.numero === numero) ?? null,
  enregistrerBrouillon: (jeton: string, reponses: Reponses, ecran: string) =>
    enSerie(async () => {
      const tout = await lire();
      const maintenant = new Date().toISOString();
      const ex = tout[jeton];
      if (ex?.statut === 'soumise') return ex; // une demande envoyée ne se modifie plus par ce canal
      tout[jeton] = { jeton, statut: 'brouillon', ecran, reponses, creeLe: ex?.creeLe ?? maintenant, misAJour: maintenant };
      await ecrire(tout);
      return tout[jeton];
    }),
  soumettre: (jeton: string, reponses: Reponses, criteres: Critere[], aValider: string[], qualification: Qualification) =>
    enSerie(async () => {
      const tout = await lire();
      const maintenant = new Date().toISOString();
      const ex = tout[jeton];
      if (ex?.dossier) return ex;
      const annee = new Date().getFullYear();
      const n = Object.values(tout).filter((d) => d.dossier?.numero.startsWith(`CEM-${annee}-`)).length + 1;
      tout[jeton] = {
        jeton,
        statut: 'soumise',
        ecran: 'merci',
        reponses,
        creeLe: ex?.creeLe ?? maintenant,
        misAJour: maintenant,
        soumiseLe: maintenant,
        dossier: { numero: `CEM-${annee}-${String(n).padStart(4, '0')}`, etape: 'DEMANDE_RECUE', criteres, aValider, qualification },
      };
      await ecrire(tout);
      return tout[jeton];
    }),
};
