'use client';

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { UI, t, tf, formatHeure, type Langue } from '@/lib/formulaire/i18n';
import type { Champ, Reponses } from '@/lib/formulaire/types';
import { ECRANS, champVisible, ecranParId, ecransVisibles } from '@/lib/formulaire/ecrans';
import { ETAPES, MOIS_PAR_URGENCE } from '@/lib/formulaire/referentiels';
import { estVide, progression, tempsRestant, validerEcran, validerTout } from '@/lib/formulaire/calculs';
import { afficherValeur, libelleRecap } from '@/lib/formulaire/affichage';
import { PersistanceApi, PersistanceLocale, nouveauJeton, type Persistance } from '@/lib/formulaire/persistance';
import { ChampFormulaire } from './Champs';
import { Merci } from './Merci';
import { ChevronLeft } from './icones';
import { AGENCE } from '@/lib/config';

type Props = {
  langue: Langue;
  /** 'api' : serveur Next.js. 'locale' : démo sans serveur (tout reste sur l'appareil). */
  mode: 'api' | 'locale';
  /** Chemin de cette page dans l'autre langue. */
  cheminAutreLangue: string;
  /** Démo : bascule de langue dans la page plutôt qu'un lien. */
  changerLangue?: () => void;
  /** Démo seulement : ouvre la fiche de recherche (vue agent) de cette demande. */
  voirFiche?: (r: Reponses) => void;
};

type Sauvegarde = { etat: 'aucune' | 'enCours' | 'ok' | 'locale'; heure?: string };

const PREMIER = ECRANS[0].id;

export function Formulaire({ langue, mode, cheminAutreLangue, changerLangue, voirFiche }: Props) {
  const locale = useMemo(() => new PersistanceLocale(), []);
  const serveur: Persistance = useMemo(() => (mode === 'api' ? new PersistanceApi() : locale), [mode, locale]);

  const [pret, setPret] = useState(false);
  const [jeton, setJeton] = useState('');
  const [reponses, setReponses] = useState<Reponses>({});
  const [ecranId, setEcranId] = useState(PREMIER);
  const [retourRecap, setRetourRecap] = useState(false);
  const [touches, setTouches] = useState<Set<string>>(new Set());
  const [tentative, setTentative] = useState(false);
  const [sauvegarde, setSauvegarde] = useState<Sauvegarde>({ etat: 'aucune' });
  const [reprisAuto, setReprisAuto] = useState(false);
  const [envoi, setEnvoi] = useState<'aucun' | 'enCours' | 'erreur'>('aucun');
  const [numero, setNumero] = useState<string | null>(null);
  const titre = useRef<HTMLHeadingElement>(null);
  const dialogue = useRef<HTMLDialogElement>(null);
  const premierRendu = useRef(true);

  // ---------- chargement : lien de reprise, brouillon de l'appareil ou nouvelle demande ----------
  useEffect(() => {
    (async () => {
      const p = new URLSearchParams(window.location.search);
      const reprise = p.get('reprise');
      let b = reprise ? (await serveur.charger(reprise)) ?? (await locale.charger(reprise)) : null;
      if (!b && !reprise) {
        const dernier = locale.dernierJeton();
        b = dernier ? await locale.charger(dernier) : null;
        if (b && Object.keys(b.reponses).length) setReprisAuto(true);
      }
      if (b) {
        setJeton(b.jeton);
        setReponses(b.reponses);
        setEcranId(ecranParId(b.ecran) ? b.ecran : PREMIER);
        setRetourRecap(!!b.retourRecap);
      } else {
        // Pré-remplissage depuis une fiche de local ou une page « type de local » : ?type=restaurant&local=L-0187
        const pre: Reponses = {};
        const type = p.get('type');
        if (type) pre['projet.types'] = type.split(',');
        if (p.get('local')) pre['projet.localInteresse'] = p.get('local');
        pre['contact.langue'] = langue;
        setJeton(reprise ?? nouveauJeton());
        setReponses(pre);
      }
      setPret(true);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- sauvegarde automatique ----------
  useEffect(() => {
    if (!pret || numero) return;
    const b = { jeton, reponses, ecran: ecranId, retourRecap, misAJour: '' };
    const local = setTimeout(() => locale.sauvegarder(b), 250);
    const aDistance = Object.keys(reponses).length > 1 && mode === 'api';
    if (aDistance) setSauvegarde((s) => ({ ...s, etat: 'enCours' }));
    const distant = setTimeout(async () => {
      if (!aDistance) {
        setSauvegarde({ etat: 'locale', heure: new Date().toISOString() });
        return;
      }
      try {
        const r = await serveur.sauvegarder(b);
        setSauvegarde({ etat: 'ok', heure: r.misAJour });
      } catch {
        setSauvegarde({ etat: 'locale', heure: new Date().toISOString() });
      }
    }, 1500);
    return () => { clearTimeout(local); clearTimeout(distant); };
  }, [reponses, ecranId, retourRecap, pret]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- navigation ----------
  const visibles = useMemo(() => ecransVisibles(reponses), [reponses]);
  const ecran = ecranParId(ecranId) ?? ECRANS[0];
  const index = visibles.findIndex((e) => e.id === ecran.id);
  const etapesVisibles = useMemo(() => [...new Set(visibles.map((e) => e.etape))], [visibles]);
  const rangEtape = etapesVisibles.indexOf(ecran.etape) + 1;
  const erreurs = useMemo(() => validerEcran(ecran, reponses), [ecran, reponses]);
  const dernier = index === visibles.length - 1;

  const aller = useCallback((id: string, historique = true) => {
    setEcranId(id);
    setTentative(false);
    setTouches(new Set());
    if (historique) try { window.history.pushState({ ecran: id }, '', `#${id}`); } catch { /* iframe */ }
  }, []);

  useEffect(() => {
    const surRetour = (e: PopStateEvent) => { if (e.state?.ecran && ecranParId(e.state.ecran)) aller(e.state.ecran, false); };
    window.addEventListener('popstate', surRetour);
    try { window.history.replaceState({ ecran: ecranId }, '', `#${ecranId}`); } catch { /* iframe */ }
    return () => window.removeEventListener('popstate', surRetour);
  }, [pret]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus sur le titre à chaque nouvel écran (lecteurs d'écran, clavier) et retour en haut.
  useEffect(() => {
    if (!pret) return;
    if (premierRendu.current) { premierRendu.current = false; return; }
    window.scrollTo({ top: 0 });
    titre.current?.focus({ preventScroll: true });
  }, [ecranId, pret]);

  const changer = (id: string, v: unknown) => setReponses((r) => ({ ...r, [id]: v }));

  // Jamais deux fois : la date idéale découle de l'échéance choisie à l'étape 2, ou de la fin du bail actuel (modifiable).
  useEffect(() => {
    if (ecranId !== 'budget-dates' || reponses['bail.dateIdeale']) return;
    const mois = MOIS_PAR_URGENCE[String(reponses['projet.urgence'])];
    const fin = reponses['actuel.finBail'] as string | undefined;
    const aujourd = new Date().toISOString().slice(0, 10);
    const suggestion = fin && fin > aujourd ? fin : mois ? new Date(Date.now() + mois * 30.4 * 864e5).toISOString().slice(0, 10) : null;
    if (suggestion) setReponses((r) => ({ ...r, 'bail.dateIdeale': suggestion, ...(fin && fin > aujourd && !r['bail.dateLimite'] ? { 'bail.dateLimite': fin } : {}) }));
  }, [ecranId]); // eslint-disable-line react-hooks/exhaustive-deps
  const quitter = (id: string) => setTouches((s) => (s.has(id) ? s : new Set(s).add(id)));

  const continuer = async (e?: FormEvent) => {
    e?.preventDefault();
    if (Object.keys(erreurs).length) {
      setTentative(true);
      requestAnimationFrame(() => {
        const premier = document.querySelector<HTMLElement>('.champ-erreur input:not(.sr-only), .champ-erreur textarea, .champ-erreur select, .champ-erreur input');
        premier?.focus();
      });
      return;
    }
    if (retourRecap && ecran.etape < 9) {
      setRetourRecap(false);
      return aller('recap');
    }
    if (!dernier) return aller(visibles[index + 1].id);
    // Envoi
    const toutes = validerTout(reponses);
    if (toutes.length) {
      setRetourRecap(true);
      aller(toutes[0].ecran);
      setTentative(true);
      return;
    }
    setEnvoi('enCours');
    try {
      const r = await serveur.soumettre({ jeton, reponses, ecran: ecranId, misAJour: '' }, langue);
      locale.oublier(jeton);
      setNumero(r.numero);
      setEnvoi('aucun');
      window.scrollTo({ top: 0 });
    } catch {
      setEnvoi('erreur');
    }
  };

  const reculer = () => {
    if (index > 0) aller(visibles[index - 1].id);
  };

  const recommencer = () => {
    locale.oublier(jeton);
    setJeton(nouveauJeton());
    setReponses({ 'contact.langue': langue });
    setReprisAuto(false);
    aller(PREMIER);
  };

  if (!pret) return <div className="formulaire-chargement" aria-busy="true" />;
  if (numero) return <Merci numero={numero} reponses={reponses} langue={langue} demo={mode === 'locale'} voirFiche={voirFiche ? () => voirFiche(reponses) : undefined} />;

  const ecranVide = ecran.champs.every((c) => !champVisible(c, reponses) || estVide(reponses[c.id]));
  const toutFacultatif = ecran.champs.every((c) => !c.requis && c.type !== 'recap');
  const libelleContinuer = dernier
    ? envoi === 'enCours' ? t(UI.envoiEnCours, langue) : t(UI.envoyer, langue)
    : retourRecap ? (langue === 'fr' ? 'Retour au récapitulatif' : 'Back to summary')
    : toutFacultatif && ecranVide ? t(UI.passer, langue) : t(UI.continuer, langue);
  const aErreurVisible = tentative && Object.keys(erreurs).length > 0;
  const lienAutre = `${cheminAutreLangue}?reprise=${encodeURIComponent(jeton)}`;

  return (
    <div className="formulaire">
      <header className="entete">
        <a className="marque" href={langue === 'fr' ? '/' : '/en/'}>
          <span className="marque-nom">{AGENCE.nomCourt}</span>
          {AGENCE.provisoire && <span className="marque-provisoire">{langue === 'fr' ? 'nom provisoire' : 'placeholder name'}</span>}
        </a>
        <div className="entete-actions">
          <button type="button" className="lien-bouton" onClick={() => dialogue.current?.showModal()}>{t(UI.finirPlusTard, langue)}</button>
          {changerLangue ? (
            <button type="button" className="lien-bouton" onClick={changerLangue} lang={langue === 'fr' ? 'en' : 'fr'}>{t(UI.langueAutre, langue)}</button>
          ) : (
            <a className="lien-bouton" href={lienAutre} lang={langue === 'fr' ? 'en' : 'fr'}>{t(UI.langueAutre, langue)}</a>
          )}
        </div>
      </header>

      <div className="progression" aria-label={tf(UI.etapeSur, langue, { n: rangEtape, total: etapesVisibles.length })}>
        <div className="progression-texte">
          <span><strong>{tf(UI.etapeSur, langue, { n: rangEtape, total: etapesVisibles.length })}</strong> · {t(ETAPES[ecran.etape - 1].titre, langue)}</span>
          <span className="indice">{tempsRestant(reponses, ecran.id, langue)}</span>
        </div>
        <div className="progression-barre" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progression(reponses, ecran.id) * 100)}>
          <span style={{ width: `${Math.max(3, progression(reponses, ecran.id) * 100)}%` }} />
        </div>
      </div>

      {reprisAuto && (
        <div className="bandeau" role="status">
          <span>{langue === 'fr' ? 'On a repris votre demande là où vous l’aviez laissée.' : 'We picked up your request where you left off.'}</span>
          <button type="button" className="lien-bouton" onClick={recommencer}>{langue === 'fr' ? 'Recommencer à zéro' : 'Start over'}</button>
        </div>
      )}

      <form className="ecran" onSubmit={continuer} noValidate>
        <h1 ref={titre} tabIndex={-1} className="ecran-titre">{t(ecran.titre, langue)}</h1>
        {ecran.intro && <p className="ecran-intro">{t(ecran.intro, langue)}</p>}
        {aErreurVisible && <p className="resume-erreurs" role="alert">{t(UI.corrigez, langue)}</p>}
        <div className="champs">
          {ecran.champs.filter((c) => champVisible(c, reponses)).map((c) => (
            <ChampFormulaire
              key={c.id}
              champ={c}
              valeur={reponses[c.id]}
              changer={(v) => changer(c.id, v)}
              quitter={() => quitter(c.id)}
              erreur={(tentative || touches.has(c.id)) && erreurs[c.id] ? erreurs[c.id] : null}
              langue={langue}
              reponses={reponses}
              recap={c.type === 'recap' ? <Recapitulatif reponses={reponses} langue={langue} modifier={(id) => { setRetourRecap(true); aller(id); }} /> : undefined}
            />
          ))}
        </div>
        {envoi === 'erreur' && (
          <p className="resume-erreurs" role="alert">
            {langue === 'fr' ? 'L’envoi n’a pas fonctionné. Vos réponses sont bien enregistrées : réessayez dans un instant.' : 'Sending failed. Your answers are saved: please try again in a moment.'}
          </p>
        )}
        <div className="pied">
          {index > 0 ? (
            <button type="button" className="bouton bouton-retour" onClick={reculer}>
              <ChevronLeft size={18} aria-hidden="true" /> {t(UI.retour, langue)}
            </button>
          ) : <span />}
          <button type="submit" className="bouton bouton-principal" disabled={envoi === 'enCours'}>{libelleContinuer}</button>
        </div>
        <p className="etat-sauvegarde" aria-live="polite">
          {sauvegarde.etat === 'enCours' && t(UI.enregistrement, langue)}
          {sauvegarde.etat === 'ok' && sauvegarde.heure && tf(UI.enregistre, langue, { heure: formatHeure(sauvegarde.heure, langue) })}
          {sauvegarde.etat === 'locale' && t(UI.horsLigne, langue)}
        </p>
      </form>

      <FinirPlusTard ref={dialogue} langue={langue} jeton={jeton} courriel={(reponses['contact.courriel'] as string) ?? ''} persistance={serveur} demo={mode === 'locale'} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Récapitulatif modifiable
// ---------------------------------------------------------------------------
function Recapitulatif({ reponses, langue, modifier }: { reponses: Reponses; langue: Langue; modifier: (ecranId: string) => void }) {
  const visibles = ecransVisibles(reponses).filter((e) => e.etape < 9);
  const parEtape = ETAPES.filter((et) => et.numero < 9)
    .map((et) => ({ et, ecrans: visibles.filter((e) => e.etape === et.numero) }))
    .filter((g) => g.ecrans.length);
  const ligne = (c: Champ) => {
    const v = afficherValeur(c, reponses[c.id], reponses, langue);
    return v ? (
      <div key={c.id} className="recap-ligne">
        <dt>{libelleRecap(c, langue)}</dt>
        <dd>{v}</dd>
      </div>
    ) : null;
  };
  return (
    <div className="recap">
      {typeof reponses['projet.localInteresse'] === 'string' && (
        <p className="bandeau">{langue === 'fr' ? 'Local qui vous a amené ici' : 'Listing that brought you here'} : <strong>{reponses['projet.localInteresse'] as string}</strong></p>
      )}
      {parEtape.map(({ et, ecrans }) => (
        <section key={et.numero} className="recap-section">
          <div className="recap-entete">
            <h2>{t(et.titre, langue)}</h2>
            <button type="button" className="lien-bouton" onClick={() => modifier(ecrans[0].id)} aria-label={`${t(UI.modifier, langue)} : ${t(et.titre, langue)}`}>{t(UI.modifier, langue)}</button>
          </div>
          <dl>{ecrans.flatMap((e) => e.champs.filter((c) => champVisible(c, reponses)).map(ligne))}</dl>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// « Finir plus tard » : lien par courriel
// ---------------------------------------------------------------------------
const FinirPlusTard = forwardRef<HTMLDialogElement, { langue: Langue; jeton: string; courriel: string; persistance: Persistance; demo: boolean }>(
  function FinirPlusTard({ langue, jeton, courriel, persistance, demo }, ref) {
    const [adresse, setAdresse] = useState(courriel);
    const [etat, setEtat] = useState<'saisie' | 'envoye' | 'erreur'>('saisie');
    const [apercu, setApercu] = useState<string | undefined>();
    useEffect(() => setAdresse((a) => a || courriel), [courriel]);
    const fr = langue === 'fr';
    const envoyer = async (e: FormEvent) => {
      e.preventDefault();
      const chemin = window.location.pathname;
      const lien = `${window.location.origin}${chemin}?reprise=${encodeURIComponent(jeton)}`;
      try {
        const r = await persistance.envoyerLienReprise(jeton, adresse, langue, lien);
        setApercu(r.apercu);
        setEtat('envoye');
      } catch {
        setEtat('erreur');
      }
    };
    return (
      <dialog ref={ref} className="dialogue" aria-labelledby="titre-plus-tard" onClose={() => setEtat('saisie')}>
        <form method="dialog" className="dialogue-fermer"><button className="lien-bouton" aria-label={t(UI.fermer, langue)}>✕</button></form>
        <h2 id="titre-plus-tard">{fr ? 'Finir plus tard' : 'Finish later'}</h2>
        {etat !== 'envoye' ? (
          <form onSubmit={envoyer}>
            <p>{fr ? 'Vos réponses sont déjà enregistrées. Recevez un lien pour reprendre sur n’importe quel appareil.' : 'Your answers are already saved. Get a link to pick up on any device.'}</p>
            <label className="libelle" htmlFor="courriel-reprise">{fr ? 'Courriel' : 'Email'}</label>
            <input id="courriel-reprise" className="saisie" type="email" autoComplete="email" required value={adresse} onChange={(e) => setAdresse(e.target.value)} />
            {etat === 'erreur' && <p className="erreur" role="alert">{fr ? 'L’envoi n’a pas fonctionné. Vérifiez l’adresse et réessayez.' : 'Sending failed. Check the address and try again.'}</p>}
            <button type="submit" className="bouton bouton-principal">{fr ? 'M’envoyer le lien' : 'Send me the link'}</button>
          </form>
        ) : (
          <div role="status">
            {demo ? (
              <>
                <p>{fr ? 'Démo : aucun courriel n’est envoyé. Voici le lien que vous recevriez :' : 'Demo: no email is sent. Here is the link you would receive:'}</p>
                <p className="lien-apercu"><code>{apercu}</code></p>
              </>
            ) : (
              <p>{fr ? `C’est envoyé à ${adresse}. Le lien est valide 30 jours.` : `Sent to ${adresse}. The link is valid for 30 days.`}</p>
            )}
            <form method="dialog"><button className="bouton bouton-secondaire">{t(UI.fermer, langue)}</button></form>
          </div>
        )}
      </dialog>
    );
  },
);
