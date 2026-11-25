'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { LEXIQUE, type CleLexique } from '@/lib/formulaire/lexique';
import { UI, t, tf, formatArgent, formatNombre, formatDateLongue, formatHeure, type Langue, type T } from '@/lib/formulaire/i18n';
import { AIDE, type Champ, type Loyer, type Niveau, type Option, type Reponses, type Superficie, type AdresseProche, type FichierJoint } from '@/lib/formulaire/types';
import { SECTEURS, prioritesPour } from '@/lib/formulaire/referentiels';
import { estimerSuperficie, mensuelVersPi2, pi2VersMensuel, positionBudget, superficieReference, chiffres } from '@/lib/formulaire/calculs';
import { types as typesChoisis } from '@/lib/formulaire/ecrans';
import { prochainsCreneaux, type Journee } from '@/lib/formulaire/creneaux';
import { Check, CircleHelp, Icone } from './icones';
import { Carte } from './Carte';

export type PropsChamp = {
  champ: Champ;
  valeur: unknown;
  changer: (v: unknown) => void;
  quitter: () => void;
  erreur: T | null;
  langue: Langue;
  reponses: Reponses;
  /** Pour l'écran récapitulatif. */
  allerA?: (ecranId: string) => void;
  recap?: ReactNode;
};

// ---------------------------------------------------------------------------
// Infobulle « ? »
// ---------------------------------------------------------------------------
export function Infobulle({ cles, langue }: { cles: CleLexique | CleLexique[]; langue: Langue }) {
  const [ouvert, setOuvert] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const liste = Array.isArray(cles) ? cles : [cles];
  const premier = LEXIQUE[liste[0]];
  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener('keydown', fermer);
    document.addEventListener('pointerdown', fermer);
    return () => {
      document.removeEventListener('keydown', fermer);
      document.removeEventListener('pointerdown', fermer);
    };
  }, [ouvert]);
  return (
    <span className="infobulle" ref={ref}>
      <button
        type="button"
        className="infobulle-bouton"
        aria-expanded={ouvert}
        aria-controls={id}
        aria-label={tf(UI.quEstCeQue, langue, { terme: t(premier.terme, langue) })}
        onClick={() => setOuvert((o) => !o)}
      >
        <CircleHelp size={18} aria-hidden="true" />
      </button>
      {ouvert && (
        <span id={id} role="note" className="infobulle-panneau">
          {liste.map((k) => (
            <span key={k} className="infobulle-terme">
              <strong>{t(LEXIQUE[k].terme, langue)}</strong>
              <span>{t(LEXIQUE[k].definition, langue)}</span>
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Enveloppe commune : libellé, aide, erreur
// ---------------------------------------------------------------------------
function Enveloppe({
  champ, langue, erreur, idChamp, groupe, children, demi,
}: { champ: Champ; langue: Langue; erreur: T | null; idChamp: string; groupe?: boolean; children: ReactNode; demi?: boolean }) {
  const requis = champ.requis === true || typeof champ.requis === 'function';
  const Libelle = groupe ? 'legend' : 'label';
  const contenuLibelle = champ.libelle ? (
    <span className="libelle-ligne">
      <Libelle className="libelle" {...(!groupe ? { htmlFor: idChamp } : {})}>
        {t(champ.libelle, langue)}
        {!requis && <span className="facultatif"> ({t(UI.facultatif, langue)})</span>}
      </Libelle>
      {champ.lexique && <Infobulle cles={champ.lexique} langue={langue} />}
    </span>
  ) : champ.lexique ? (
    <span className="libelle-ligne libelle-seul">
      {groupe && <legend className="sr-only">{t(UI.plusieursChoix, langue)}</legend>}
      <Infobulle cles={champ.lexique} langue={langue} />
    </span>
  ) : null;
  const corps = (
    <>
      {contenuLibelle}
      {champ.aide && <p className="aide" id={`${idChamp}-aide`}>{t(champ.aide, langue)}</p>}
      {children}
      <p className="erreur" id={`${idChamp}-erreur`} role={erreur ? 'alert' : undefined}>
        {erreur ? t(erreur, langue) : ''}
      </p>
    </>
  );
  const cls = `champ ${demi ? 'champ-demi' : ''} ${erreur ? 'champ-erreur' : ''}`;
  return groupe ? (
    <fieldset className={cls} data-champ={champ.id} aria-describedby={erreur ? `${idChamp}-erreur` : undefined}>
      {corps}
    </fieldset>
  ) : (
    <div className={cls} data-champ={champ.id}>{corps}</div>
  );
}

const aria = (id: string, erreur: T | null, aide?: boolean) => ({
  id,
  'aria-invalid': erreur ? true : undefined,
  'aria-describedby': [aide ? `${id}-aide` : '', erreur ? `${id}-erreur` : ''].filter(Boolean).join(' ') || undefined,
});

// ---------------------------------------------------------------------------
// Tuiles (choix unique ou multiple) – vraies cases radio / à cocher, donc clavier natif
// ---------------------------------------------------------------------------
function Tuiles({
  nom, options, multiple, compact, valeur, changer, quitter, langue, technique, erreur,
}: {
  nom: string; options: Option[]; multiple?: boolean; compact?: boolean; valeur: unknown; changer: (v: unknown) => void;
  quitter: () => void; langue: Langue; technique?: boolean; erreur: T | null;
}) {
  const choix = multiple ? ((Array.isArray(valeur) ? valeur : []) as string[]) : valeur;
  const toutes: Option[] = technique ? [...options, { valeur: AIDE, libelle: UI.aide, icone: 'CircleHelp' }] : options;
  const coche = (v: string) => (multiple ? (choix as string[]).includes(v) : choix === v);
  const basculer = (v: string) => {
    if (!multiple) return changer(v);
    const liste = choix as string[];
    if (v === AIDE) return changer(liste.includes(AIDE) ? [] : [AIDE]);
    const sans = liste.filter((x) => x !== AIDE);
    changer(sans.includes(v) ? sans.filter((x) => x !== v) : [...sans, v]);
  };
  return (
    <div className={`tuiles ${compact ? 'tuiles-compactes' : ''}`}>
      {multiple && <p className="indice">{t(UI.plusieursChoix, langue)}</p>}
      {toutes.map((o) => (
        <label key={o.valeur} className={`tuile ${coche(o.valeur) ? 'tuile-choisie' : ''} ${o.valeur === AIDE ? 'tuile-aide' : ''}`}>
          <input
            type={multiple ? 'checkbox' : 'radio'}
            name={nom}
            value={o.valeur}
            checked={coche(o.valeur)}
            onChange={() => basculer(o.valeur)}
            onBlur={quitter}
            aria-invalid={erreur ? true : undefined}
            className="sr-only"
          />
          {o.icone && <span className="tuile-icone"><Icone nom={o.icone} /></span>}
          <span className="tuile-texte">
            <span className="tuile-libelle">{t(o.libelle, langue)}</span>
            {o.description && <span className="tuile-description">{t(o.description, langue)}</span>}
          </span>
          <span className="tuile-coche" aria-hidden="true"><Check size={16} strokeWidth={2.5} /></span>
        </label>
      ))}
    </div>
  );
}

/** Bouton « Je ne sais pas » pour les champs numériques techniques. */
function BoutonAide({ actif, basculer, langue }: { actif: boolean; basculer: () => void; langue: Langue }) {
  return (
    <button type="button" className={`puce puce-aide ${actif ? 'puce-active' : ''}`} aria-pressed={actif} onClick={basculer}>
      <CircleHelp size={16} aria-hidden="true" /> {t(UI.aide, langue)}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Champ générique
// ---------------------------------------------------------------------------
export function ChampFormulaire(p: PropsChamp) {
  const { champ, valeur, changer, quitter, erreur, langue, reponses } = p;
  const idChamp = `f-${champ.id.replace(/\./g, '-')}`;

  switch (champ.type) {
    case 'texte': {
      const type = champ.format === 'courriel' ? 'email' : champ.format === 'telephone' ? 'tel' : 'text';
      const inputMode = champ.format === 'neq' ? 'numeric' : champ.format === 'telephone' ? 'tel' : champ.format === 'courriel' ? 'email' : undefined;
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} demi={champ.demi}>
          <input
            {...aria(idChamp, erreur, !!champ.aide)}
            className="saisie"
            type={type}
            inputMode={inputMode}
            autoComplete={champ.autocomplete ?? 'off'}
            placeholder={champ.placeholder ? t(champ.placeholder, langue) : undefined}
            value={(valeur as string) ?? ''}
            onChange={(e) => changer(champ.format === 'neq' ? chiffres(e.target.value).slice(0, 10) : e.target.value)}
            onBlur={quitter}
            maxLength={champ.format === 'neq' ? 10 : 200}
          />
        </Enveloppe>
      );
    }
    case 'zone_texte': {
      const v = (valeur as string) ?? '';
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp}>
          <textarea
            {...aria(idChamp, erreur, !!champ.aide)}
            aria-label={champ.libelle ? undefined : t(champ.recap ?? { fr: 'Votre réponse', en: 'Your answer' }, langue)}
            className="saisie zone"
            rows={champ.lignes ?? 4}
            maxLength={champ.max}
            placeholder={champ.placeholder ? t(champ.placeholder, langue) : undefined}
            value={v}
            onChange={(e) => changer(e.target.value)}
            onBlur={quitter}
          />
          {champ.max && <p className="compteur" aria-live="off">{formatNombre(v.length, langue)} / {formatNombre(champ.max, langue)}</p>}
        </Enveloppe>
      );
    }
    case 'nombre': {
      const aide = valeur === AIDE;
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} demi={champ.demi && !champ.technique}>
          <div className="nombre-ligne">
            <span className="avec-unite">
              <input
                {...aria(idChamp, erreur, !!champ.aide)}
                className="saisie saisie-nombre"
                type="number"
                inputMode="numeric"
                min={champ.min}
                max={champ.max}
                disabled={aide}
                value={typeof valeur === 'number' ? valeur : ''}
                onChange={(e) => changer(e.target.value === '' ? null : Number(e.target.value))}
                onBlur={quitter}
              />
              {champ.unite && <span className="unite">{t(champ.unite, langue)}</span>}
            </span>
            {champ.technique && <BoutonAide actif={aide} basculer={() => changer(aide ? null : AIDE)} langue={langue} />}
          </div>
        </Enveloppe>
      );
    }
    case 'date':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} demi={champ.demi}>
          <input {...aria(idChamp, erreur, !!champ.aide)} className="saisie" type="date" value={(valeur as string) ?? ''} onChange={(e) => changer(e.target.value)} onBlur={quitter} />
        </Enveloppe>
      );
    case 'tuiles':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <Tuiles nom={idChamp} options={champ.options} multiple={champ.multiple} compact={champ.compact} valeur={valeur} changer={changer} quitter={quitter} langue={langue} technique={champ.technique} erreur={erreur} />
        </Enveloppe>
      );
    case 'secteurs':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <Secteurs valeur={(valeur as string[]) ?? []} changer={changer} langue={langue} />
        </Enveloppe>
      );
    case 'importance':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <Importance facteurs={champ.facteurs} valeur={(valeur as Record<string, number>) ?? {}} changer={changer} langue={langue} nom={idChamp} />
        </Enveloppe>
      );
    case 'superficie':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <ChampSuperficie valeur={(valeur as Superficie) ?? { min: null, max: null }} changer={changer} quitter={quitter} langue={langue} reponses={reponses} idChamp={idChamp} />
        </Enveloppe>
      );
    case 'loyer':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <ChampLoyer valeur={(valeur as Loyer) ?? { mode: 'mensuel', mensuel: null, pi2: null }} changer={changer} quitter={quitter} langue={langue} reponses={reponses} idChamp={idChamp} />
        </Enveloppe>
      );
    case 'priorites':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <Priorites valeur={(valeur as Record<string, Niveau>) ?? {}} changer={changer} langue={langue} types={typesChoisis(reponses)} nom={idChamp} />
        </Enveloppe>
      );
    case 'carte':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp}>
          <Carte valeur={(valeur as [number, number][]) ?? []} changer={changer} langue={langue} />
        </Enveloppe>
      );
    case 'adresses':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <Adresses valeur={(valeur as AdresseProche[]) ?? []} changer={changer} langue={langue} />
        </Enveloppe>
      );
    case 'fichiers':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp}>
          <Fichiers valeur={(valeur as FichierJoint[]) ?? []} changer={changer} langue={langue} idChamp={idChamp} />
        </Enveloppe>
      );
    case 'liens':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <Liens valeur={(valeur as string[]) ?? []} changer={changer} langue={langue} />
        </Enveloppe>
      );
    case 'recap':
      return <>{p.recap}</>;
    case 'rendezvous':
      return (
        <Enveloppe champ={champ} langue={langue} erreur={erreur} idChamp={idChamp} groupe>
          <RendezVousChoix valeur={valeur as { debut: string; fin: string } | 'plus_tard' | null} changer={changer} langue={langue} />
        </Enveloppe>
      );
    case 'consentement':
      return (
        <div className={`champ consentement ${erreur ? 'champ-erreur' : ''}`} data-champ={champ.id}>
          <label className="case">
            <input type="checkbox" {...aria(idChamp, erreur)} checked={valeur === true} onChange={(e) => changer(e.target.checked)} />
            <span>
              {t(champ.texte, langue)}{' '}
              {champ.lien && (
                <a href={t(champ.lien.href, langue)} target="_blank" rel="noopener">
                  {t(champ.lien.libelle, langue)}
                </a>
              )}
            </span>
          </label>
          <p className="erreur" id={`${idChamp}-erreur`} role={erreur ? 'alert' : undefined}>{erreur ? t(erreur, langue) : ''}</p>
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Secteurs
// ---------------------------------------------------------------------------
function Secteurs({ valeur, changer, langue }: { valeur: string[]; changer: (v: unknown) => void; langue: Langue }) {
  const aide = valeur.includes(AIDE);
  const basculer = (code: string) =>
    changer(valeur.includes(code) ? valeur.filter((v) => v !== code) : [...valeur.filter((v) => v !== AIDE), code]);
  return (
    <div className="secteurs">
      {SECTEURS.map((g) => (
        <div key={t(g.groupe, 'fr')} className="secteurs-groupe">
          <p className="secteurs-titre">{t(g.groupe, langue)}</p>
          <div className="puces">
            {g.secteurs.map((s) => (
              <label key={s.code} className={`puce ${valeur.includes(s.code) ? 'puce-active' : ''}`}>
                <input type="checkbox" className="sr-only" checked={valeur.includes(s.code)} onChange={() => basculer(s.code)} />
                {valeur.includes(s.code) && <Check size={14} strokeWidth={2.5} aria-hidden="true" />}
                {s.nom}
              </label>
            ))}
          </div>
        </div>
      ))}
      <label className={`puce puce-aide ${aide ? 'puce-active' : ''}`}>
        <input type="checkbox" className="sr-only" checked={aide} onChange={() => changer(aide ? [] : [AIDE])} />
        <CircleHelp size={16} aria-hidden="true" />
        {langue === 'fr' ? 'Je ne sais pas encore : conseillez-moi' : 'Not sure yet: advise me'}
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Importance 1 à 5
// ---------------------------------------------------------------------------
function Importance({ facteurs, valeur, changer, langue, nom }: { facteurs: Option[]; valeur: Record<string, number>; changer: (v: unknown) => void; langue: Langue; nom: string }) {
  return (
    <div className="importance">
      {facteurs.map((f) => (
        <div key={f.valeur} className="importance-ligne" role="radiogroup" aria-label={t(f.libelle, langue)}>
          <span className="importance-libelle"><Icone nom={f.icone} taille={20} /> {t(f.libelle, langue)}</span>
          <span className="echelle">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={`echelon ${valeur[f.valeur] === n ? 'echelon-actif' : ''}`}>
                <input type="radio" className="sr-only" name={`${nom}-${f.valeur}`} checked={valeur[f.valeur] === n} onChange={() => changer({ ...valeur, [f.valeur]: n })} />
                <span aria-hidden="true">{n}</span>
                <span className="sr-only">{n} {langue === 'fr' ? 'sur 5' : 'out of 5'}</span>
              </label>
            ))}
          </span>
        </div>
      ))}
      <p className="indice echelle-legende" aria-hidden="true">
        <span>1 = {langue === 'fr' ? 'pas important' : 'not important'}</span>
        <span>5 = {langue === 'fr' ? 'essentiel' : 'essential'}</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Superficie : deux saisies + curseur double + estimation
// ---------------------------------------------------------------------------
function ChampSuperficie({ valeur, changer, quitter, langue, reponses, idChamp }: { valeur: Superficie; changer: (v: unknown) => void; quitter: () => void; langue: Langue; reponses: Reponses; idChamp: string }) {
  const est = estimerSuperficie(reponses);
  const [montrerEst, setMontrerEst] = useState(false);
  const plafond = typesChoisis(reponses).includes('industriel') ? 100000 : 20000;
  const pas = plafond > 20000 ? 500 : 50;
  const min = valeur.min ?? 0;
  const max = valeur.max ?? plafond;
  const maj = (k: 'min' | 'max', v: number | null) => changer({ ...valeur, [k]: v });
  const m2 = (pi: number) => Math.round(pi / 10.764);
  return (
    <div className="superficie">
      <div className="nombre-paire">
        {(['min', 'max'] as const).map((k) => (
          <div key={k} className="champ-demi">
            <label className="libelle" htmlFor={`${idChamp}-${k}`}>{k === 'min' ? (langue === 'fr' ? 'Minimum' : 'Minimum') : langue === 'fr' ? 'Maximum' : 'Maximum'}</label>
            <span className="avec-unite">
              <input id={`${idChamp}-${k}`} className="saisie saisie-nombre" type="number" inputMode="numeric" min={0} step={pas} value={valeur[k] ?? ''} onChange={(e) => maj(k, e.target.value === '' ? null : Number(e.target.value))} onBlur={quitter} />
              <span className="unite">pi²</span>
            </span>
            {valeur[k] ? <span className="indice">≈ {formatNombre(m2(valeur[k]!), langue)} m²</span> : null}
          </div>
        ))}
      </div>
      <div className="curseur-double" aria-hidden="false">
        <input type="range" min={0} max={plafond} step={pas} value={Math.min(min, plafond)} aria-label={langue === 'fr' ? 'Superficie minimale' : 'Minimum size'} aria-valuetext={`${formatNombre(min, langue)} pi²`} onChange={(e) => maj('min', Math.min(Number(e.target.value), max))} />
        <input type="range" min={0} max={plafond} step={pas} value={Math.min(max, plafond)} aria-label={langue === 'fr' ? 'Superficie maximale' : 'Maximum size'} aria-valuetext={`${formatNombre(max, langue)} pi²`} onChange={(e) => maj('max', Math.max(Number(e.target.value), min))} />
        <div className="curseur-piste"><span style={{ left: `${(Math.min(min, plafond) / plafond) * 100}%`, right: `${100 - (Math.min(max, plafond) / plafond) * 100}%` }} /></div>
      </div>
      <button type="button" className="lien-bouton" onClick={() => setMontrerEst((s) => !s)} aria-expanded={montrerEst}>
        <CircleHelp size={16} aria-hidden="true" /> {langue === 'fr' ? 'Aidez-moi à estimer' : 'Help me estimate'}
      </button>
      {montrerEst && (
        <div className="encadre" role="status">
          {est ? (
            <>
              <p>
                {langue === 'fr'
                  ? `Pour ${formatNombre(est.personnes, langue)} personnes, on compte en général ${est.ratio[0]} à ${est.ratio[1]} pi² par personne pour ce type de local : `
                  : `For ${formatNombre(est.personnes, langue)} people, this type of space usually needs ${est.ratio[0]} to ${est.ratio[1]} sq. ft. per person: `}
                <strong>{formatNombre(est.min, langue)} – {formatNombre(est.max, langue)} pi²</strong>.
                {est.hybride && (langue === 'fr' ? ' On a tenu compte du travail hybride (postes partagés).' : ' We accounted for hybrid work (shared desks).')}
                {est.actuel && (langue === 'fr' ? ` Votre local actuel : ${formatNombre(est.actuel, langue)} pi².` : ` Your current space: ${formatNombre(est.actuel, langue)} sq. ft.`)}
              </p>
              <button type="button" className="bouton bouton-secondaire" onClick={() => { changer({ min: est.min, max: est.max }); setMontrerEst(false); }}>
                {langue === 'fr' ? 'Utiliser cette estimation' : 'Use this estimate'}
              </button>
            </>
          ) : (
            <p>{langue === 'fr' ? 'Indiquez d’abord le nombre de personnes à l’écran précédent : on fera le calcul pour vous.' : 'First enter the number of people on the previous screen: we will do the math for you.'}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loyer : mensuel total OU $/pi²/an, conversion automatique
// ---------------------------------------------------------------------------
function ChampLoyer({ valeur, changer, quitter, langue, reponses, idChamp }: { valeur: Loyer; changer: (v: unknown) => void; quitter: () => void; langue: Langue; reponses: Reponses; idChamp: string }) {
  const ref = superficieReference(reponses['espace.superficie'] as Superficie | undefined);
  const montant = valeur.mode === 'mensuel' ? valeur.mensuel : valeur.pi2;
  const changerMode = (mode: Loyer['mode']) => {
    if (mode === valeur.mode) return;
    // On convertit la valeur déjà saisie pour que le client n'ait pas à la retaper.
    if (ref && mode === 'pi2' && valeur.mensuel) return changer({ mode, mensuel: valeur.mensuel, pi2: mensuelVersPi2(valeur.mensuel, ref) });
    if (ref && mode === 'mensuel' && valeur.pi2) return changer({ mode, pi2: valeur.pi2, mensuel: pi2VersMensuel(valeur.pi2, ref) });
    changer({ ...valeur, mode });
  };
  const conversion =
    ref && montant
      ? valeur.mode === 'mensuel'
        ? langue === 'fr'
          ? `≈ ${formatArgent(mensuelVersPi2(montant, ref), langue, 2)} /pi²/an pour ${formatNombre(ref, langue)} pi²`
          : `≈ ${formatArgent(mensuelVersPi2(montant, ref), langue, 2)} /sq. ft./yr for ${formatNombre(ref, langue)} sq. ft.`
        : langue === 'fr'
          ? `≈ ${formatArgent(pi2VersMensuel(montant, ref), langue)} par mois pour ${formatNombre(ref, langue)} pi²`
          : `≈ ${formatArgent(pi2VersMensuel(montant, ref), langue)} per month for ${formatNombre(ref, langue)} sq. ft.`
      : null;
  return (
    <div className="loyer">
      <div className="bascule" role="radiogroup" aria-label={langue === 'fr' ? 'Façon d’indiquer le budget' : 'How to enter the budget'}>
        {(['mensuel', 'pi2'] as const).map((m) => (
          <label key={m} className={`bascule-option ${valeur.mode === m ? 'bascule-active' : ''}`}>
            <input type="radio" className="sr-only" name={`${idChamp}-mode`} checked={valeur.mode === m} onChange={() => changerMode(m)} />
            {m === 'mensuel' ? (langue === 'fr' ? 'Total par mois' : 'Total per month') : langue === 'fr' ? 'Prix au pi² par an' : 'Price per sq. ft. per year'}
          </label>
        ))}
      </div>
      <label className="libelle" htmlFor={`${idChamp}-montant`}>
        {valeur.mode === 'mensuel'
          ? langue === 'fr' ? 'Montant maximal par mois, tout compris (loyer + frais), avant taxes' : 'Maximum per month, all-in (rent + costs), before taxes'
          : langue === 'fr' ? 'Loyer maximal au pi² par année' : 'Maximum rent per sq. ft. per year'}
      </label>
      <span className="avec-unite">
        <input id={`${idChamp}-montant`} className="saisie saisie-nombre" type="number" inputMode="decimal" min={0} step={valeur.mode === 'mensuel' ? 100 : 0.5} value={montant ?? ''}
          onChange={(e) => {
            const n = e.target.value === '' ? null : Number(e.target.value);
            changer(valeur.mode === 'mensuel' ? { ...valeur, mensuel: n, pi2: n && ref ? mensuelVersPi2(n, ref) : null } : { ...valeur, pi2: n, mensuel: n && ref ? pi2VersMensuel(n, ref) : null });
          }}
          onBlur={quitter}
        />
        <span className="unite">{valeur.mode === 'mensuel' ? '$ / mois' : '$ / pi² / an'}</span>
      </span>
      <p className="conversion" aria-live="polite">{conversion ?? (ref ? '' : langue === 'fr' ? 'Astuce : indiquez une superficie à l’étape 4 pour voir la conversion.' : 'Tip: enter a size in step 4 to see the conversion.')}</p>
      <RepereMarche reponses={reponses} langue={langue} />
    </div>
  );
}

/** Repère de marché : rassure si le budget est réaliste, prépare la discussion sinon. */
function RepereMarche({ reponses, langue }: { reponses: Reponses; langue: Langue }) {
  const pos = positionBudget(reponses);
  if (!pos) return null;
  const fr = langue === 'fr';
  const [bas, haut] = pos.fourchette;
  const fourchette = fr ? `${bas} à ${haut} $/pi²/an` : `$${bas} to $${haut}/sq. ft./yr`;
  const texte = {
    dans: fr
      ? `Votre budget se situe dans la fourchette habituelle pour ce type de local à Montréal (${fourchette}, tout compris).`
      : `Your budget is within the usual range for this type of space in Montréal (${fourchette}, all-in).`,
    sous: fr
      ? `Votre budget est un peu sous la fourchette habituelle (${fourchette}, tout compris). Pas de panique : on regardera des secteurs voisins, des locaux à rafraîchir ou une superficie ajustée, et on en parlera pendant l’appel.`
      : `Your budget is a bit below the usual range (${fourchette}, all-in). Don’t worry: we will look at nearby areas, spaces needing a refresh or an adjusted size, and discuss it on the call.`,
    au_dessus: fr
      ? `Votre budget dépasse la fourchette habituelle (${fourchette}, tout compris) : vous aurez accès aux meilleurs emplacements.`
      : `Your budget is above the usual range (${fourchette}, all-in): you will have access to the best locations.`,
  }[pos.position];
  return (
    <div className={`encadre repere repere-${pos.position}`} role="status">
      <p>{texte}</p>
      <p className="indice">{fr ? 'Fourchette indicative, mise à jour par nos courtiers.' : 'Indicative range, updated by our brokers.'}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Priorités : Obligatoire / Souhaitable / Pas important
// ---------------------------------------------------------------------------
const NIVEAUX: { v: Niveau; l: T }[] = [
  { v: 'obligatoire', l: { fr: 'Obligatoire', en: 'Must-have' } },
  { v: 'souhaitable', l: { fr: 'Souhaitable', en: 'Nice to have' } },
  { v: 'pas_important', l: { fr: 'Pas important', en: 'Not important' } },
];
function Priorites({ valeur, changer, langue, types, nom }: { valeur: Record<string, Niveau>; changer: (v: unknown) => void; langue: Langue; types: string[]; nom: string }) {
  return (
    <div className="priorites">
      {prioritesPour(types).map((p) => {
        const actuel = valeur[p.code] ?? 'pas_important';
        return (
          <div key={p.code} className="priorite-ligne" role="radiogroup" aria-label={t(p.libelle, langue)}>
            <span className="priorite-libelle">{t(p.libelle, langue)}</span>
            <span className="segments">
              {NIVEAUX.map((n) => (
                <label key={n.v} className={`segment segment-${n.v} ${actuel === n.v ? 'segment-actif' : ''}`}>
                  <input type="radio" className="sr-only" name={`${nom}-${p.code}`} checked={actuel === n.v} onChange={() => changer({ ...valeur, [p.code]: n.v })} />
                  {t(n.l, langue)}
                </label>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Adresses à proximité
// ---------------------------------------------------------------------------
const LIBELLES_ADRESSE: Option[] = [
  { valeur: 'domicile', libelle: { fr: 'Mon domicile', en: 'My home' } },
  { valeur: 'clients', libelle: { fr: 'Mes clients', en: 'My clients' } },
  { valeur: 'fournisseurs', libelle: { fr: 'Mes fournisseurs', en: 'My suppliers' } },
  { valeur: 'actuel', libelle: { fr: 'Mon local actuel', en: 'My current space' } },
  { valeur: 'autre', libelle: { fr: 'Autre', en: 'Other' } },
];
function Adresses({ valeur, changer, langue }: { valeur: AdresseProche[]; changer: (v: unknown) => void; langue: Langue }) {
  const maj = (i: number, a: Partial<AdresseProche>) => changer(valeur.map((x, j) => (j === i ? { ...x, ...a } : x)));
  return (
    <div className="adresses">
      <legend className="libelle">{langue === 'fr' ? 'Adresses à proximité' : 'Nearby addresses'} <span className="facultatif">({t(UI.facultatif, langue)})</span></legend>
      {valeur.map((a, i) => (
        <div key={i} className="adresse-ligne">
          <select className="saisie" aria-label={langue === 'fr' ? `Type d’adresse ${i + 1}` : `Address type ${i + 1}`} value={a.libelle} onChange={(e) => maj(i, { libelle: e.target.value })}>
            {LIBELLES_ADRESSE.map((o) => <option key={o.valeur} value={o.valeur}>{t(o.libelle, langue)}</option>)}
          </select>
          <input className="saisie" aria-label={langue === 'fr' ? `Adresse ${i + 1}` : `Address ${i + 1}`} autoComplete="street-address" placeholder={langue === 'fr' ? 'Adresse ou intersection' : 'Address or intersection'} value={a.adresse} onChange={(e) => maj(i, { adresse: e.target.value })} />
          <button type="button" className="lien-bouton" onClick={() => changer(valeur.filter((_, j) => j !== i))}>{langue === 'fr' ? 'Retirer' : 'Remove'}</button>
        </div>
      ))}
      {valeur.length < 5 && (
        <button type="button" className="bouton bouton-secondaire" onClick={() => changer([...valeur, { libelle: valeur.length ? 'clients' : 'domicile', adresse: '' }])}>
          + {langue === 'fr' ? 'Ajouter une adresse' : 'Add an address'}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fichiers (métadonnées ; le téléversement chiffré arrive avec l'espace client, étape 4)
// ---------------------------------------------------------------------------
const TAILLE_MAX = 25 * 1024 * 1024;
function Fichiers({ valeur, changer, langue, idChamp }: { valeur: FichierJoint[]; changer: (v: unknown) => void; langue: Langue; idChamp: string }) {
  const [refus, setRefus] = useState<string | null>(null);
  return (
    <div className="fichiers">
      <label htmlFor={idChamp} className="depot-fichiers">
        <span className="libelle">{langue === 'fr' ? 'Photos, plans ou PDF' : 'Photos, plans or PDFs'}</span>
        <span className="indice">{langue === 'fr' ? 'JPG, PNG, HEIC ou PDF, 25 Mo max par fichier' : 'JPG, PNG, HEIC or PDF, 25 MB max per file'}</span>
        <input
          id={idChamp}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/heic,application/pdf"
          onChange={(e) => {
            const nouveaux = Array.from(e.target.files ?? []);
            const trop = nouveaux.filter((f) => f.size > TAILLE_MAX);
            setRefus(trop.length ? (langue === 'fr' ? `Trop lourd (plus de 25 Mo) : ${trop.map((f) => f.name).join(', ')}` : `Too large (over 25 MB): ${trop.map((f) => f.name).join(', ')}`) : null);
            changer([...valeur, ...nouveaux.filter((f) => f.size <= TAILLE_MAX).map((f) => ({ nom: f.name, taille: f.size, type: f.type }))].slice(0, 10));
            e.target.value = '';
          }}
        />
      </label>
      {refus && <p className="erreur" role="alert">{refus}</p>}
      {valeur.length > 0 && (
        <ul className="liste-fichiers">
          {valeur.map((f, i) => (
            <li key={`${f.nom}-${i}`}>
              <span>{f.nom} <span className="indice">({formatNombre(Math.max(1, Math.round(f.taille / 1024)), langue)} Ko)</span></span>
              <button type="button" className="lien-bouton" onClick={() => changer(valeur.filter((_, j) => j !== i))}>{langue === 'fr' ? 'Retirer' : 'Remove'}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Liens
// ---------------------------------------------------------------------------
function Liens({ valeur, changer, langue }: { valeur: string[]; changer: (v: unknown) => void; langue: Langue }) {
  const liste = valeur.length ? valeur : [''];
  const invalide = (u: string) => u.trim() !== '' && !/^https?:\/\/\S+\.\S+/.test(u.trim());
  return (
    <div className="liens">
      <legend className="libelle">{langue === 'fr' ? 'Liens vers des locaux qui vous intéressent' : 'Links to spaces you like'} <span className="facultatif">({t(UI.facultatif, langue)})</span></legend>
      {liste.map((u, i) => (
        <div key={i}>
          <input className="saisie" type="url" inputMode="url" aria-label={`${langue === 'fr' ? 'Lien' : 'Link'} ${i + 1}`} placeholder="https://" value={u} aria-invalid={invalide(u) || undefined}
            onChange={(e) => changer(liste.map((x, j) => (j === i ? e.target.value : x)))} />
          {invalide(u) && <p className="erreur">{langue === 'fr' ? 'Ce lien doit commencer par https://' : 'This link must start with https://'}</p>}
        </div>
      ))}
      {liste.length < 5 && (
        <button type="button" className="bouton bouton-secondaire" onClick={() => changer([...liste, ''])}>+ {langue === 'fr' ? 'Ajouter un lien' : 'Add a link'}</button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rendez-vous
// ---------------------------------------------------------------------------
function RendezVousChoix({ valeur, changer, langue }: { valeur: { debut: string; fin: string } | 'plus_tard' | null; changer: (v: unknown) => void; langue: Langue }) {
  const [jours, setJours] = useState<Journee[]>([]);
  const [jour, setJour] = useState(0);
  useEffect(() => {
    const j = prochainsCreneaux();
    setJours(j);
    if (valeur && valeur !== 'plus_tard') {
      const i = j.findIndex((x) => x.creneaux.some((c) => c.debut === valeur.debut));
      if (i >= 0) setJour(i);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!jours.length) return <p className="indice">{langue === 'fr' ? 'Chargement des disponibilités…' : 'Loading availability…'}</p>;
  const choisi = valeur && valeur !== 'plus_tard' ? valeur.debut : null;
  return (
    <div className="rdv">
      <p className="indice">{langue === 'fr' ? 'Heure de Montréal. Appel ou visioconférence, à votre choix.' : 'Montréal time. Phone or video, your choice.'}</p>
      <div className="rdv-jours" role="tablist" aria-label={langue === 'fr' ? 'Jours disponibles' : 'Available days'}>
        {jours.map((j, i) => (
          <button key={j.jour} type="button" role="tab" aria-selected={i === jour} className={`rdv-jour ${i === jour ? 'rdv-jour-actif' : ''}`} onClick={() => setJour(i)}>
            {formatDateLongue(`${j.jour}T16:00:00Z`, langue)}
          </button>
        ))}
      </div>
      <div className="rdv-creneaux" role="radiogroup" aria-label={langue === 'fr' ? 'Heures disponibles' : 'Available times'}>
        {jours[jour].creneaux.filter((c) => c.libre).map((c) => (
          <label key={c.debut} className={`puce rdv-creneau ${choisi === c.debut ? 'puce-active' : ''}`}>
            <input type="radio" className="sr-only" name="rdv" checked={choisi === c.debut} onChange={() => changer({ debut: c.debut, fin: c.fin })} />
            {formatHeure(c.debut, langue)}
          </label>
        ))}
      </div>
      {choisi && (
        <p className="confirmation-rdv" role="status">
          <Check size={18} aria-hidden="true" /> {formatDateLongue(choisi, langue)}, {formatHeure(choisi, langue)} (20 min)
        </p>
      )}
      <label className={`puce puce-aide ${valeur === 'plus_tard' ? 'puce-active' : ''}`}>
        <input type="checkbox" className="sr-only" checked={valeur === 'plus_tard'} onChange={(e) => changer(e.target.checked ? 'plus_tard' : null)} />
        {langue === 'fr' ? 'Aucune plage ne me convient : appelez-moi pour en fixer une' : 'None of these work: call me to set a time'}
      </label>
    </div>
  );
}
