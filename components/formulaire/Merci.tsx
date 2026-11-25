'use client';

import { formatDateLongue, formatHeure, type Langue } from '@/lib/formulaire/i18n';
import type { Reponses } from '@/lib/formulaire/types';
import { Check } from './icones';

/** Écran de remerciement : prochaines étapes et délais, sans jargon. */
export function Merci({ numero, reponses, langue, demo = false }: { numero: string; reponses: Reponses; langue: Langue; demo?: boolean }) {
  const fr = langue === 'fr';
  const rdv = reponses['rdv.creneau'] as { debut: string } | 'plus_tard' | undefined;
  const prenom = (reponses['contact.prenom'] as string) ?? '';
  const courriel = (reponses['contact.courriel'] as string) ?? '';
  const etapes = [
    {
      titre: fr ? 'Votre appel découverte' : 'Your discovery call',
      texte:
        rdv && rdv !== 'plus_tard'
          ? `${formatDateLongue(rdv.debut, langue)}, ${formatHeure(rdv.debut, langue)}. ${fr ? 'L’invitation est dans votre courriel, avec un rappel 24 h et 2 h avant.' : 'The invitation is in your email, with reminders 24 h and 2 h before.'}`
          : fr ? 'Un agent vous appelle d’ici 1 jour ouvrable pour fixer un moment.' : 'An agent will call you within 1 business day to set a time.',
    },
    {
      titre: fr ? 'On cherche pour vous' : 'We search for you',
      texte: fr ? 'Inventaire de l’agence, réseau de propriétaires et locaux pas encore annoncés.' : 'Our inventory, our landlord network and spaces not yet listed.',
    },
    {
      titre: fr ? 'Votre sélection de 3 à 5 locaux' : 'Your shortlist of 3 to 5 spaces',
      texte: fr ? 'Sous 48 à 72 h ouvrables après l’appel, avec un score de correspondance pour chacun.' : 'Within 48 to 72 business hours after the call, each with a match score.',
    },
  ];
  return (
    <div className="formulaire merci">
      <div className="merci-sceau" aria-hidden="true"><Check size={32} strokeWidth={2.2} /></div>
      <h1 className="ecran-titre" tabIndex={-1}>{fr ? `Merci${prenom ? ' ' + prenom : ''}, c’est reçu.` : `Thank you${prenom ? ' ' + prenom : ''}, we have it.`}</h1>
      <p className="ecran-intro">
        {fr ? 'Numéro de dossier' : 'File number'} : <strong>{numero}</strong>
        <br />
        {fr ? `Un résumé de votre demande et l’accès à votre espace client partent à ${courriel}.` : `A summary of your request and access to your client portal are on their way to ${courriel}.`}
      </p>
      <h2 className="merci-sous-titre">{fr ? 'Et maintenant ?' : 'What happens next?'}</h2>
      <ol className="merci-etapes">
        {etapes.map((e, i) => (
          <li key={i}>
            <span className="merci-numero" aria-hidden="true">{i + 1}</span>
            <span>
              <strong>{e.titre}</strong>
              <span className="indice">{e.texte}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="indice">
        {fr ? 'Vous n’avez rien d’autre à remplir pour l’instant. Une question ? Répondez simplement au courriel de confirmation.' : 'There is nothing else to fill in for now. Questions? Just reply to the confirmation email.'}
      </p>
      {demo ? (
        <p className="bandeau">{fr ? 'Démo : le courriel de confirmation et l’espace client arrivent aux étapes 4 et 6.' : 'Demo: the confirmation email and client portal arrive in steps 4 and 6.'}</p>
      ) : (
      <div className="pied pied-merci">
        <button type="button" className="bouton bouton-secondaire" onClick={() => window.print()}>
          {fr ? 'Imprimer ou enregistrer en PDF' : 'Print or save as PDF'}
        </button>
        <a className="bouton bouton-principal" href={fr ? '/connexion' : '/en/login'}>{fr ? 'Accéder à mon espace client' : 'Go to my client portal'}</a>
      </div>
      )}
    </div>
  );
}
