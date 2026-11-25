import { courrielValide, telephoneValide } from '@/lib/formulaire/calculs';
import type { Langue } from '@/lib/formulaire/i18n';

export type MessageContact = { nom: string; courriel: string; telephone: string; message: string; consentement: string; site: string };
export type ErreursContact = Partial<Record<keyof MessageContact, string>>;

/** Validation partagée navigateur / serveur. `site` est un piège à robots (doit rester vide). */
export function validerContact(d: Partial<MessageContact>, l: Langue): ErreursContact {
  const fr = l === 'fr';
  const e: ErreursContact = {};
  if (!d.nom?.trim()) e.nom = fr ? 'Indiquez votre nom.' : 'Please enter your name.';
  if (!d.courriel?.trim()) e.courriel = fr ? 'Indiquez votre courriel pour qu’on puisse vous répondre.' : 'Please enter your email so we can reply.';
  else if (!courrielValide(d.courriel)) e.courriel = fr ? 'Ce courriel semble incomplet. Exemple : nom@entreprise.com' : 'This email looks incomplete. Example: name@company.com';
  if (d.telephone?.trim() && !telephoneValide(d.telephone)) e.telephone = fr ? 'Ce numéro semble incomplet. Exemple : 514 555-0123' : 'This number looks incomplete. Example: 514-555-0123';
  if (!d.message?.trim() || d.message.trim().length < 10) e.message = fr ? 'Dites-nous en quelques mots comment on peut vous aider.' : 'Tell us in a few words how we can help.';
  else if (d.message.length > 4000) e.message = fr ? 'Votre message est un peu long : 4 000 caractères au maximum.' : 'Your message is a bit long: 4,000 characters maximum.';
  if (d.consentement !== 'oui') e.consentement = fr ? 'Votre accord est nécessaire pour qu’on vous réponde.' : 'Your consent is needed for us to reply.';
  return e;
}
