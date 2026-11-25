'use client';

import { useState, type FormEvent } from 'react';
import type { Langue } from '@/lib/formulaire/i18n';
import { validerContact, type ErreursContact, type MessageContact } from '@/lib/site/contact';
import { lien } from '@/lib/site/liens';
import { Lien } from './Lien';

async function envoyerApi(d: Record<string, string>) {
  const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) });
  return r.ok;
}

export function FormulaireContact({ langue, envoyer = envoyerApi }: { langue: Langue; envoyer?: (d: Record<string, string>) => Promise<boolean> }) {
  const fr = langue === 'fr';
  const [erreurs, setErreurs] = useState<ErreursContact>({});
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'envoye' | 'echec'>('saisie');

  const soumettre = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const d = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)])) as Record<string, string>;
    d.consentement = fd.get('consentement') ? 'oui' : '';
    d.langue = langue;
    const e = validerContact(d as Partial<MessageContact>, langue);
    setErreurs(e);
    const premier = Object.keys(e)[0];
    if (premier) {
      form.querySelector<HTMLElement>(`[name="${premier}"]`)?.focus();
      return;
    }
    setEtat('envoi');
    try {
      setEtat((await envoyer(d)) ? 'envoye' : 'echec');
    } catch {
      setEtat('echec');
    }
  };

  if (etat === 'envoye') {
    return (
      <div className="encadre-site" role="status">
        <h3>{fr ? 'Merci, votre message est bien reçu.' : 'Thank you, your message has been received.'}</h3>
        <p>{fr ? 'On vous répond en moins d’un jour ouvrable.' : 'We will reply within one business day.'}</p>
      </div>
    );
  }

  const champ = (nom: keyof MessageContact, libelle: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, facultatif = false) => (
    <div className="champ-site">
      <label htmlFor={`c-${nom}`}>{libelle}{facultatif && <span className="facultatif"> {fr ? '(facultatif)' : '(optional)'}</span>}</label>
      <input id={`c-${nom}`} name={nom} aria-invalid={!!erreurs[nom]} aria-describedby={erreurs[nom] ? `c-${nom}-err` : undefined} {...props} />
      {erreurs[nom] && <p id={`c-${nom}-err`} className="erreur-site">{erreurs[nom]}</p>}
    </div>
  );

  return (
    <form className="formulaire-site" noValidate onSubmit={soumettre}>
      {champ('nom', fr ? 'Votre nom' : 'Your name', { autoComplete: 'name' })}
      {champ('courriel', fr ? 'Courriel' : 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
      {champ('telephone', fr ? 'Téléphone' : 'Phone', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' }, true)}
      <div className="champ-site">
        <label htmlFor="c-message">{fr ? 'Votre message' : 'Your message'}</label>
        <textarea id="c-message" name="message" rows={5} maxLength={4000} aria-invalid={!!erreurs.message} aria-describedby={erreurs.message ? 'c-message-err' : undefined} />
        {erreurs.message && <p id="c-message-err" className="erreur-site">{erreurs.message}</p>}
      </div>
      <div className="piege" aria-hidden="true">
        <label htmlFor="c-site">Site</label>
        <input id="c-site" name="site" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="champ-site">
        <label className="case-site">
          <input type="checkbox" name="consentement" aria-invalid={!!erreurs.consentement} aria-describedby={erreurs.consentement ? 'c-consentement-err' : undefined} />
          <span>
            {fr ? 'J’accepte que mes renseignements servent à répondre à ma demande. ' : 'I agree that my information will be used to answer my request. '}
            <Lien href={lien('confidentialite', langue)}>{fr ? 'Politique de confidentialité' : 'Privacy policy'}</Lien>
          </span>
        </label>
        {erreurs.consentement && <p id="c-consentement-err" className="erreur-site">{erreurs.consentement}</p>}
      </div>
      {etat === 'echec' && <p className="erreur-site" role="alert">{fr ? 'L’envoi n’a pas fonctionné. Réessayez, ou écrivez-nous directement par courriel.' : 'Sending failed. Please try again, or email us directly.'}</p>}
      <button type="submit" className="bouton bouton-principal" disabled={etat === 'envoi'}>
        {etat === 'envoi' ? (fr ? 'Envoi…' : 'Sending…') : fr ? 'Envoyer' : 'Send'}
      </button>
    </form>
  );
}
