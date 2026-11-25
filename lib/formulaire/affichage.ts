/** Mise en forme lisible des réponses (récapitulatif, futur PDF de la demande, fiche client). */
import { UI, formatArgent, formatDateLongue, formatHeure, formatNombre, t, type Langue } from './i18n';
import { AIDE, type AdresseProche, type Champ, type FichierJoint, type Loyer, type Niveau, type Reponses, type Superficie } from './types';
import { FACTEURS_EMPLACEMENT, PRIORITES, nomSecteur } from './referentiels';
import { loyerComplet } from './calculs';

const AIDE_TXT = { fr: 'À valider avec votre agent', en: 'To confirm with your agent' };

export function afficherValeur(c: Champ, v: unknown, r: Reponses, langue: Langue): string | null {
  if (v === AIDE || (Array.isArray(v) && v.length === 1 && v[0] === AIDE)) return t(AIDE_TXT, langue);
  if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) return null;
  const fr = langue === 'fr';
  switch (c.type) {
    case 'tuiles': {
      const liste = Array.isArray(v) ? (v as string[]) : [v as string];
      return liste.map((x) => t(c.options.find((o) => o.valeur === x)?.libelle ?? x, langue)).join(', ');
    }
    case 'secteurs':
      return (v as string[]).map(nomSecteur).join(', ');
    case 'importance': {
      const o = v as Record<string, number>;
      return FACTEURS_EMPLACEMENT.filter((f) => o[f.valeur] !== undefined)
        .sort((a, b) => (o[b.valeur] ?? 0) - (o[a.valeur] ?? 0))
        .map((f) => `${t(f.libelle, langue)} ${o[f.valeur]}/5`)
        .join(' · ');
    }
    case 'superficie': {
      const s = v as Superficie;
      if (!s.min && !s.max) return null;
      const u = fr ? 'pi²' : 'sq. ft.';
      if (s.min && s.max) return `${formatNombre(s.min, langue)} – ${formatNombre(s.max, langue)} ${u}`;
      return s.min ? `${fr ? 'Au moins' : 'At least'} ${formatNombre(s.min, langue)} ${u}` : `${fr ? 'Au plus' : 'At most'} ${formatNombre(s.max!, langue)} ${u}`;
    }
    case 'loyer': {
      const l = loyerComplet(v as Loyer, r['espace.superficie'] as Superficie);
      if (!l || !(l.mensuel || l.pi2)) return null;
      const parts = [];
      if (l.mensuel) parts.push(`${formatArgent(l.mensuel, langue)} ${fr ? 'par mois' : 'per month'}`);
      if (l.pi2) parts.push(`${formatArgent(l.pi2, langue, 2)} /${fr ? 'pi²/an' : 'sq. ft./yr'}`);
      return l.mode === 'mensuel' ? parts.join(' (≈ ') + (parts.length > 1 ? ')' : '') : parts.reverse().join(' (≈ ') + (parts.length > 1 ? ')' : '');
    }
    case 'priorites': {
      const o = v as Record<string, Niveau>;
      const lib = (n: Niveau) => PRIORITES.filter((p) => o[p.code] === n).map((p) => t(p.libelle, langue));
      const ob = lib('obligatoire'), so = lib('souhaitable');
      const out = [];
      if (ob.length) out.push(`${fr ? 'Obligatoire' : 'Must-have'} : ${ob.join(', ')}`);
      if (so.length) out.push(`${fr ? 'Souhaitable' : 'Nice to have'} : ${so.join(', ')}`);
      return out.join(' · ') || null;
    }
    case 'adresses': {
      const a = (v as AdresseProche[]).filter((x) => x.adresse.trim());
      return a.length ? a.map((x) => x.adresse).join(' · ') : null;
    }
    case 'carte':
      return (v as unknown[]).length >= 3 ? (fr ? `Zone tracée (${(v as unknown[]).length} points)` : `Area drawn (${(v as unknown[]).length} points)`) : null;
    case 'fichiers':
      return (v as FichierJoint[]).map((f) => f.nom).join(', ');
    case 'liens': {
      const l = (v as string[]).filter((x) => x.trim());
      return l.length ? l.join(' · ') : null;
    }
    case 'nombre':
      return `${formatNombre(v as number, langue)}${c.unite ? ' ' + t(c.unite, langue) : ''}`;
    case 'date':
      return formatDateLongue(`${v}T16:00:00Z`, langue);
    case 'rendezvous':
      if (v === 'plus_tard') return fr ? 'On vous appellera pour fixer un moment' : 'We will call you to set a time';
      return `${formatDateLongue((v as { debut: string }).debut, langue)}, ${formatHeure((v as { debut: string }).debut, langue)}`;
    case 'consentement':
      return v === true ? (fr ? 'Oui' : 'Yes') : (fr ? 'Non' : 'No');
    case 'zone_texte':
    case 'texte':
      return String(v);
    default:
      return null;
  }
}

export const libelleRecap = (c: Champ, langue: Langue) => t(c.recap ?? c.libelle ?? UI.nonRepondu, langue);
