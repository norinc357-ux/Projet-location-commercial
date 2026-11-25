'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { AGENCE } from '@/lib/config';
import type { Langue } from '@/lib/formulaire/i18n';
import { autreLangue, lien } from '@/lib/site/liens';
import { Lien } from './Lien';

const NAV = [
  { page: 'commentCaMarche', fr: 'Comment ça marche', en: 'How it works' },
  { page: 'types', fr: 'Types de locaux', en: 'Space types' },
  { page: 'guide', fr: 'Guide du locataire', en: 'Tenant guide' },
  { page: 'aPropos', fr: 'À propos', en: 'About' },
  { page: 'contact', fr: 'Contact', en: 'Contact' },
] as const;

export function Logo({ langue }: { langue: Langue }) {
  return (
    <Lien href={lien('accueil', langue)} className="logo" aria-label={`${AGENCE.nom}, ${langue === 'fr' ? 'accueil' : 'home'}`}>
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="7" fill="var(--marine)" />
        <path d="M9 23V13l7-5 7 5v10h-5v-6h-4v6z" fill="none" stroke="var(--or)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span>{AGENCE.nom}</span>
    </Lien>
  );
}

export function Coquille({ langue, chemin, children }: { langue: Langue; chemin: string; children: React.ReactNode }) {
  const fr = langue === 'fr';
  const [ouvert, setOuvert] = useState(false);
  useEffect(() => setOuvert(false), [chemin]);
  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: KeyboardEvent) => e.key === 'Escape' && setOuvert(false);
    window.addEventListener('keydown', fermer);
    return () => window.removeEventListener('keydown', fermer);
  }, [ouvert]);

  return (
    <div className="site" lang={fr ? 'fr-CA' : 'en-CA'}>
      <a className="lien-evitement" href="#contenu">{fr ? 'Aller au contenu' : 'Skip to content'}</a>
      <header className="site-entete">
        <div className="site-entete-interieur">
          <Logo langue={langue} />
          <nav id="nav-principale" className={`nav ${ouvert ? 'nav-ouverte' : ''}`} aria-label={fr ? 'Navigation principale' : 'Main navigation'}>
            <ul>
              {NAV.map((n) => {
                const href = lien(n.page, langue);
                const actif = chemin === href || chemin.startsWith(`${href}/`);
                return (
                  <li key={n.page}>
                    <Lien href={href} aria-current={actif ? 'page' : undefined}>{n[langue]}</Lien>
                  </li>
                );
              })}
              <li className="nav-secondaire"><Lien href={lien('connexion', langue)}>{fr ? 'Espace client' : 'Client portal'}</Lien></li>
            </ul>
          </nav>
          <div className="site-entete-actions">
            <Lien href={autreLangue(chemin, langue)} className="langue" hrefLang={fr ? 'en-CA' : 'fr-CA'} lang={fr ? 'en-CA' : 'fr-CA'}>
              {fr ? 'EN' : 'FR'}<span className="sr-only">{fr ? ' — English version' : ' — version française'}</span>
            </Lien>
            <Lien href={lien('formulaire', langue)} className="bouton bouton-principal bouton-entete">{fr ? 'Décrire mon projet' : 'Describe my project'}</Lien>
            <button type="button" className="menu-bouton" aria-expanded={ouvert} aria-controls="nav-principale" onClick={() => setOuvert((o) => !o)}>
              {ouvert ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              <span className="sr-only">{fr ? 'Menu' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="contenu" tabIndex={-1}>{children}</main>

      <footer className="pied-site">
        <div className="pied-site-interieur">
          <div>
            <Logo langue={langue} />
            <p className="pied-texte">
              {fr ? 'Location de locaux commerciaux à Montréal et dans les environs. Service clé en main, de la recherche à la remise des clés.' : 'Commercial space leasing in Montréal and surrounding areas. Turnkey service, from search to key handover.'}
            </p>
            <p className="pied-texte">
              {fr ? `Agence immobilière titulaire d’un permis de l’OACIQ (no ${AGENCE.permisOaciq}).` : `Real estate agency licensed by the OACIQ (no. ${AGENCE.permisOaciq}).`}
            </p>
          </div>
          <div>
            <h2 className="pied-titre">{fr ? 'Nous joindre' : 'Contact us'}</h2>
            <p className="pied-texte">
              <a href={`tel:${AGENCE.telephoneLien}`}><Phone size={16} aria-hidden="true" /> {AGENCE.telephone}</a><br />
              <a href={`mailto:${AGENCE.courriel}`}>{AGENCE.courriel}</a><br />
              {AGENCE.heures[langue]}
            </p>
            <p className="pied-texte pied-exemple">{fr ? 'Coordonnées d’exemple' : 'Sample contact details'}</p>
          </div>
          <div>
            <h2 className="pied-titre">{fr ? 'Liens' : 'Links'}</h2>
            <ul className="pied-liens">
              {NAV.map((n) => <li key={n.page}><Lien href={lien(n.page, langue)}>{n[langue]}</Lien></li>)}
              <li><Lien href={lien('connexion', langue)}>{fr ? 'Espace client' : 'Client portal'}</Lien></li>
              <li><Lien href={lien('confidentialite', langue)}>{fr ? 'Politique de confidentialité' : 'Privacy policy'}</Lien></li>
            </ul>
          </div>
        </div>
        <p className="pied-bas">© {new Date().getFullYear()} {AGENCE.nom}{AGENCE.provisoire ? (fr ? ' (nom provisoire)' : ' (working name)') : ''}</p>
      </footer>

      <div className="cta-mobile">
        <Lien href={lien('formulaire', langue)} className="bouton bouton-principal">{fr ? 'Décrire mon projet' : 'Describe my project'}</Lien>
      </div>
    </div>
  );
}
