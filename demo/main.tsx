import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Formulaire } from '@/components/formulaire/Formulaire';
import { FicheRecherche } from '@/components/agence/FicheRecherche';
import { Coquille } from '@/components/site/Coquille';
import { FournisseurLiens } from '@/components/site/Lien';
import { PageAccueil, PageAPropos, PageCommentCaMarche, PageConfidentialite, PageConnexion, PageContact, PageGuide, PageTypeLocal, PageTypes } from '@/components/site/Pages';
import '@/components/formulaire/formulaire.css';
import '@/components/site/site.css';
import type { Langue } from '@/lib/formulaire/i18n';
import type { Reponses } from '@/lib/formulaire/types';
import { construireFiche } from '@/lib/formulaire/ficheRecherche';
import { DEMANDE_EXEMPLE_CAFE } from '@/lib/exemples';
import { PAGES, typeDepuisSlug, type CleePage } from '@/lib/site/liens';

/** Démo autonome : tout le site dans un seul fichier, navigation par « #/chemin ». */
const lireRoute = () => {
  const brut = window.location.hash.replace(/^#/, '') || '/';
  const [chemin, ancre] = brut.split('#');
  return { chemin: chemin || '/', ancre };
};

function Demo() {
  const [route, setRoute] = useState(lireRoute);
  const [ficheClient, setFicheClient] = useState<Reponses | null>(null);

  useEffect(() => {
    const changer = () => setRoute(lireRoute());
    window.addEventListener('hashchange', changer);
    // Ancres internes (#baux) : on fait défiler sans changer de page.
    const clic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const h = a?.getAttribute('href');
      if (h && h.startsWith('#') && !h.startsWith('#/')) {
        e.preventDefault();
        document.getElementById(h.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', clic);
    return () => { window.removeEventListener('hashchange', changer); document.removeEventListener('click', clic); };
  }, []);

  useEffect(() => {
    if (route.ancre) requestAnimationFrame(() => document.getElementById(route.ancre!)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [route]);

  const { chemin } = route;
  const langue: Langue = chemin === '/en' || chemin.startsWith('/en/') ? 'en' : 'fr';
  const aller = (c: string) => { window.location.hash = c; };

  let contenu: React.ReactNode;
  const page = (Object.keys(PAGES) as CleePage[]).find((k) => PAGES[k][langue] === chemin);
  if (chemin === '/agence/fiche') {
    contenu = (
      <div lang="fr-CA">
        <p className="bascule-vues"><a href="#/">← Retour au site</a></p>
        <FicheRecherche fiche={construireFiche(ficheClient ?? DEMANDE_EXEMPLE_CAFE)} exemple={!ficheClient} numero={ficheClient ? 'CEM-DEMO' : undefined} />
      </div>
    );
  } else if (page === 'formulaire') {
    return (
      <div lang={langue === 'fr' ? 'fr-CA' : 'en-CA'}>
        <BandeauDemo langue={langue} />
        <Formulaire
          key={langue}
          langue={langue}
          mode="locale"
          cheminAutreLangue=""
          changerLangue={() => aller(PAGES.formulaire[langue === 'fr' ? 'en' : 'fr'])}
          voirFiche={(r) => { setFicheClient(r); aller('/agence/fiche'); }}
        />
      </div>
    );
  } else {
    const prefixe = `${PAGES.types[langue]}/`;
    const type = chemin.startsWith(prefixe) ? typeDepuisSlug(chemin.slice(prefixe.length), langue) : null;
    const pages: Partial<Record<CleePage, React.ReactNode>> = {
      accueil: <PageAccueil langue={langue} />,
      commentCaMarche: <PageCommentCaMarche langue={langue} />,
      types: <PageTypes langue={langue} />,
      guide: <PageGuide langue={langue} />,
      aPropos: <PageAPropos langue={langue} />,
      contact: <PageContact langue={langue} envoyer={() => new Promise((ok) => setTimeout(() => ok(true), 600))} />,
      confidentialite: <PageConfidentialite langue={langue} />,
      connexion: <PageConnexion langue={langue} />,
    };
    contenu = (
      <Coquille langue={langue} chemin={chemin}>
        {type ? <PageTypeLocal langue={langue} type={type} /> : (page && pages[page]) ?? <PageAccueil langue={langue} />}
      </Coquille>
    );
  }
  return (
    <>
      <BandeauDemo langue={langue} />
      {contenu}
    </>
  );
}

function BandeauDemo({ langue }: { langue: Langue }) {
  const fr = langue === 'fr';
  return (
    <p className="bandeau-demo">
      {fr ? 'Démo : rien n’est envoyé, vos réponses restent sur cet appareil. ' : 'Demo: nothing is sent, your answers stay on this device. '}
      <a href="#/agence/fiche" style={{ color: 'inherit' }}>{fr ? 'Voir la fiche de recherche (vue agence)' : 'See the agency search sheet'}</a>
    </p>
  );
}

createRoot(document.getElementById('racine')!).render(
  <StrictMode>
    <FournisseurLiens value={(h) => `#${h}`}>
      <Demo />
    </FournisseurLiens>
  </StrictMode>,
);
