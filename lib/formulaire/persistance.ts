/**
 * Sauvegarde du brouillon.
 * - `PersistanceLocale` : sur l'appareil (localStorage). Toujours utilisée, même en ligne, pour ne rien perdre.
 * - `PersistanceApi` : sur le serveur (routes /api/demandes), pour reprendre sur un autre appareil via le lien par courriel.
 */
import type { Langue } from './i18n';
import type { Reponses } from './types';

export type Brouillon = { jeton: string; reponses: Reponses; ecran: string; retourRecap?: boolean; misAJour: string };
export type ResultatEnvoi = { numero: string };

export interface Persistance {
  sauvegarder(b: Brouillon): Promise<{ misAJour: string }>;
  charger(jeton: string): Promise<Brouillon | null>;
  envoyerLienReprise(jeton: string, courriel: string, langue: Langue, lien: string): Promise<{ envoye: boolean; apercu?: string }>;
  soumettre(b: Brouillon, langue: Langue): Promise<ResultatEnvoi>;
}

export const nouveauJeton = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => ((Math.random() * 16) | (c === 'y' ? 8 : 0)).toString(16));

const CLE = (jeton: string) => `cem:brouillon:${jeton}`;
const CLE_DERNIER = 'cem:dernier';

const stockage = (): Storage | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
};

export class PersistanceLocale implements Persistance {
  async sauvegarder(b: Brouillon) {
    const misAJour = new Date().toISOString();
    try {
      stockage()?.setItem(CLE(b.jeton), JSON.stringify({ ...b, misAJour }));
      stockage()?.setItem(CLE_DERNIER, b.jeton);
    } catch {
      /* stockage plein ou bloqué : on continue sans planter */
    }
    return { misAJour };
  }
  async charger(jeton: string) {
    try {
      const brut = stockage()?.getItem(CLE(jeton));
      return brut ? (JSON.parse(brut) as Brouillon) : null;
    } catch {
      return null;
    }
  }
  /** Dernier brouillon de cet appareil (reprise automatique sans lien). */
  dernierJeton(): string | null {
    try {
      return stockage()?.getItem(CLE_DERNIER) ?? null;
    } catch {
      return null;
    }
  }
  oublier(jeton: string) {
    try {
      stockage()?.removeItem(CLE(jeton));
      if (stockage()?.getItem(CLE_DERNIER) === jeton) stockage()?.removeItem(CLE_DERNIER);
    } catch {
      /* rien */
    }
  }
  async envoyerLienReprise(_j: string, _c: string, _l: Langue, lien: string) {
    // Mode démo : aucun courriel n'est envoyé, on montre le lien.
    return { envoye: false, apercu: lien };
  }
  async soumettre(b: Brouillon) {
    const n = Math.abs([...b.jeton].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7)) % 10000;
    return { numero: `CEM-${new Date().getFullYear()}-${String(n).padStart(4, '0')}` };
  }
}

export class PersistanceApi implements Persistance {
  constructor(private base = '/api/demandes') {}
  private async json<R>(url: string, init?: RequestInit): Promise<R> {
    const res = await fetch(url, { ...init, headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) } });
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status, corps: await res.json().catch(() => null) });
    return res.json() as Promise<R>;
  }
  sauvegarder(b: Brouillon) {
    return this.json<{ misAJour: string }>(`${this.base}/${encodeURIComponent(b.jeton)}`, { method: 'PUT', body: JSON.stringify(b) });
  }
  async charger(jeton: string) {
    try {
      return await this.json<Brouillon>(`${this.base}/${encodeURIComponent(jeton)}`);
    } catch {
      return null;
    }
  }
  envoyerLienReprise(jeton: string, courriel: string, langue: Langue, lien: string) {
    return this.json<{ envoye: boolean; apercu?: string }>(`${this.base}/${encodeURIComponent(jeton)}/reprise`, {
      method: 'POST',
      body: JSON.stringify({ courriel, langue, lien }),
    });
  }
  soumettre(b: Brouillon, langue: Langue) {
    return this.json<ResultatEnvoi>(`${this.base}/${encodeURIComponent(b.jeton)}/soumettre`, {
      method: 'POST',
      body: JSON.stringify({ reponses: b.reponses, langue }),
    });
  }
}
