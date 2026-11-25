/**
 * Envoi de courriels. En développement : affiché dans la console.
 * À l'étape 6 : Amazon SES (région Canada) ou Postmark, gabarits complets FR/EN.
 */
import type { Langue } from '@/lib/formulaire/i18n';
import { AGENCE } from '@/lib/config';

export type Courriel = { a: string; sujet: string; texte: string };

export interface Expediteur {
  envoyer(c: Courriel): Promise<void>;
}

export const expediteurConsole: Expediteur = {
  async envoyer(c) {
    console.info(`\n[courriel] À : ${c.a}\n[courriel] Sujet : ${c.sujet}\n${c.texte}\n`);
  },
};

export function courrielReprise(langue: Langue, prenom: string, lien: string): Omit<Courriel, 'a'> {
  return langue === 'fr'
    ? {
        sujet: 'Votre demande vous attend',
        texte: `Bonjour ${prenom || ''},\n\nVotre demande est enregistrée. Reprenez exactement où vous étiez, sur n'importe quel appareil :\n${lien}\n\nCe lien est personnel : ne le transférez pas. Il expire dans 30 jours.\n\nL'équipe de ${AGENCE.nom}`,
      }
    : {
        sujet: 'Your request is waiting for you',
        texte: `Hello ${prenom || ''},\n\nYour request is saved. Pick up exactly where you left off, on any device:\n${lien}\n\nThis link is personal: please don't forward it. It expires in 30 days.\n\nThe ${AGENCE.nom} team`,
      };
}

export const expediteur: Expediteur = expediteurConsole;
