'use client';

import { useState } from 'react';
import { NIVEAUX as NIVEAU, ficheEnTexte, type Fiche, type LigneCritere } from '@/lib/formulaire/ficheRecherche';
import { formatArgent } from '@/lib/formulaire/i18n';


const DRAPEAU: Record<string, string> = {
  budget_sous_marche: 'Budget sous le marché',
  financement_pas_encore: 'Financement à confirmer',
  autre_courtier: 'Autre courtier',
  decision_en_equipe: 'Décision en équipe',
  fin_bail_proche: 'Fin de bail proche',
  beaucoup_de_visites: 'A beaucoup visité',
  points_a_valider: 'Points à clarifier',
};

function Liste({ lignes, vide }: { lignes: LigneCritere[]; vide: string }) {
  if (!lignes.length) return <p className="fiche-vide">{vide}</p>;
  return (
    <ul className="fiche-criteres">
      {lignes.map((l) => (
        <li key={l.code}>
          <span>{l.libelle}</span>
          {l.valeur && <strong>{l.valeur}</strong>}
        </li>
      ))}
    </ul>
  );
}

export function FicheRecherche({ fiche, numero, exemple }: { fiche: Fiche; numero?: string; exemple?: boolean }) {
  const [copie, setCopie] = useState<'aucune' | 'ok' | 'echec'>('aucune');
  const copier = async () => {
    try {
      await navigator.clipboard.writeText(ficheEnTexte(fiche));
      setCopie('ok');
    } catch {
      setCopie('echec');
    }
  };
  const q = fiche.qualification;
  const b = fiche.budget;
  return (
    <article className="fiche">
      {exemple && <p className="fiche-exemple">EXEMPLE : client fictif</p>}
      <header className="fiche-entete">
        <div>
          <p className="fiche-surtitre">Fiche de recherche{numero ? ` · ${numero}` : ''}</p>
          <h1 className="fiche-titre">{fiche.client.entreprise || 'Entreprise'}</h1>
          <p className="fiche-resume">{fiche.resume}</p>
        </div>
        <div className={`fiche-score fiche-score-${q.niveau}`} aria-label={`Priorité ${q.score} sur 100`}>
          <span className="fiche-score-chiffre">{q.score}</span>
          <span className="fiche-score-libelle">{NIVEAU[q.niveau]}</span>
        </div>
      </header>

      {q.drapeaux.length > 0 && (
        <ul className="fiche-drapeaux" aria-label="Signaux">
          {q.drapeaux.map((d) => <li key={d}>{DRAPEAU[d]}</li>)}
        </ul>
      )}

      <section className="fiche-contact">
        <span><strong>{fiche.client.nom}</strong> · {fiche.client.statut}{fiche.client.neq ? ` · NEQ ${fiche.client.neq}` : ''}</span>
        <span>{fiche.client.telephone} · {fiche.client.courriel}</span>
        <span>Préfère : {fiche.client.mode.toLowerCase()} · {fiche.client.langue}</span>
      </section>

      <div className="fiche-grille">
        <section className="fiche-bloc fiche-bloc-obligatoire">
          <h2>Obligatoire</h2>
          <p className="fiche-aide">Un local qui manque l’un de ces points est écarté.</p>
          <Liste lignes={fiche.obligatoires} vide="Aucun critère obligatoire." />
        </section>
        <section className="fiche-bloc">
          <h2>Souhaitable</h2>
          <p className="fiche-aide">Du plus important au moins important.</p>
          <Liste lignes={fiche.souhaitables} vide="Aucun critère souhaitable." />
          {fiche.eliminatoires.length > 0 && (
            <>
              <h3>À écarter</h3>
              <Liste lignes={fiche.eliminatoires} vide="" />
            </>
          )}
        </section>
      </div>

      <section className="fiche-bloc">
        <h2>Budget</h2>
        <dl className="fiche-budget">
          <div><dt>Par mois, tout compris</dt><dd>{b.mensuel ? formatArgent(b.mensuel, 'fr') : '—'}</dd></div>
          <div><dt>Au pi² par an</dt><dd>{b.pi2 ? formatArgent(b.pi2, 'fr', 2) : '—'}</dd></div>
          <div><dt>Marché</dt><dd>{b.position ? `${b.position.fourchette[0]} à ${b.position.fourchette[1]} $ · ${b.position.position === 'dans' ? 'dans la fourchette' : b.position.position === 'sous' ? 'sous la fourchette' : 'au-dessus'}` : '—'}</dd></div>
          <div><dt>Améliorations locatives</dt><dd>{b.ameliorations ?? '—'}</dd></div>
          <div><dt>Garantie personnelle</dt><dd>{b.garantie ?? '—'}</dd></div>
          <div><dt>Dépôt</dt><dd>{b.depot ?? '—'}</dd></div>
        </dl>
      </section>

      <section className="fiche-bloc fiche-filtres">
        <div className="fiche-bloc-entete">
          <h2>Filtres pour Centris, LoopNet et l’inventaire</h2>
          <button type="button" className="bouton bouton-secondaire" onClick={copier}>Copier la fiche</button>
        </div>
        {copie === 'ok' && <p className="fiche-aide" role="status">Copiée. Collez-la dans un courriel ou une note.</p>}
        {copie === 'echec' && <p className="fiche-aide" role="status">La copie a été bloquée : sélectionnez le texte à la main.</p>}
        <dl className="fiche-budget">
          {fiche.filtres.map((f) => <div key={f.libelle}><dt>{f.libelle}</dt><dd>{f.valeur}</dd></div>)}
        </dl>
      </section>

      <section className="fiche-bloc fiche-questions">
        <h2>À demander pendant l’appel découverte</h2>
        <ol>{fiche.questions.map((x) => <li key={x}>{x}</li>)}</ol>
      </section>

      {(fiche.motsDuClient.usage || fiche.motsDuClient.description) && (
        <section className="fiche-bloc">
          <h2>Dans ses mots</h2>
          {fiche.motsDuClient.usage && <p><strong>Usage :</strong> {fiche.motsDuClient.usage}</p>}
          {fiche.motsDuClient.description && <blockquote>{fiche.motsDuClient.description}</blockquote>}
          {fiche.motsDuClient.localInteresse && <p><strong>Arrivé par le local :</strong> {fiche.motsDuClient.localInteresse}</p>}
          {fiche.motsDuClient.liens.length > 0 && (
            <ul>{fiche.motsDuClient.liens.map((l) => <li key={l}><a href={l} target="_blank" rel="noopener noreferrer">{l}</a></li>)}</ul>
          )}
        </section>
      )}

      {fiche.contexte.length > 0 && (
        <section className="fiche-bloc">
          <h2>Contexte</h2>
          <dl className="fiche-budget">
            {fiche.contexte.map((c) => <div key={c.libelle}><dt>{c.libelle}</dt><dd>{c.valeur}</dd></div>)}
          </dl>
        </section>
      )}
    </article>
  );
}
