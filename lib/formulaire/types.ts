import type { T } from './i18n';
import type { CleLexique } from './lexique';

/** Réponses du formulaire : une seule clé par information (principe « jamais deux fois »). */
export type Reponses = Record<string, unknown>;

export type TypeLocal = 'bureau' | 'commerce' | 'restaurant' | 'industriel' | 'clinique' | 'atelier' | 'mixte';
export type Niveau = 'obligatoire' | 'souhaitable' | 'pas_important';

/** Valeur spéciale enregistrée quand le client choisit « Je ne sais pas / Aidez-moi à choisir ». */
export const AIDE = 'aide';

export type Option = { valeur: string; libelle: T; icone?: string; description?: T };

export type Condition = (r: Reponses) => boolean;

type Base = {
  /** Clé dans les réponses. Préfixe = section (contact., projet., …). */
  id: string;
  libelle?: T;
  /** Texte d'aide sous le libellé. */
  aide?: T;
  /** Terme du lexique expliqué par l'infobulle « ? ». */
  lexique?: CleLexique | CleLexique[];
  requis?: boolean | Condition;
  visible?: Condition;
  /** Question technique : ajoute l'option « Je ne sais pas / Aidez-moi à choisir ». */
  technique?: boolean;
  /** Validation supplémentaire. Retourne un message poli ou null. */
  valider?: (valeur: unknown, r: Reponses) => T | null;
  /** Libellé court pour le récapitulatif. */
  recap?: T;
};

export type Champ = Base &
  (
    | { type: 'texte'; format?: 'courriel' | 'telephone' | 'neq'; autocomplete?: string; placeholder?: T; demi?: boolean }
    | { type: 'zone_texte'; lignes?: number; max?: number; placeholder?: T }
    | { type: 'nombre'; unite?: T; min?: number; max?: number; demi?: boolean; placeholder?: T }
    | { type: 'tuiles'; options: Option[]; multiple?: boolean; compact?: boolean }
    | { type: 'secteurs' }
    | { type: 'importance'; facteurs: Option[] }
    | { type: 'superficie' }
    | { type: 'loyer' }
    | { type: 'date'; demi?: boolean }
    | { type: 'priorites' }
    | { type: 'carte' }
    | { type: 'adresses' }
    | { type: 'fichiers' }
    | { type: 'liens' }
    | { type: 'recap' }
    | { type: 'rendezvous' }
    | { type: 'consentement'; texte: T; lien?: { libelle: T; href: T } }
  );

export type TypeChamp = Champ['type'];

export type Ecran = {
  id: string;
  etape: number;
  titre: T;
  intro?: T;
  champs: Champ[];
  visible?: Condition;
};

export type Etape = { numero: number; titre: T };

export type Superficie = { min: number | null; max: number | null };
export type Loyer = { mode: 'mensuel' | 'pi2'; mensuel: number | null; pi2: number | null };
export type AdresseProche = { libelle: string; adresse: string };
export type FichierJoint = { nom: string; taille: number; type: string };
export type RendezVous = { debut: string; fin: string; agent: string };
