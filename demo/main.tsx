import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Formulaire } from '@/components/formulaire/Formulaire';
import { FicheRecherche } from '@/components/agence/FicheRecherche';
import '@/components/formulaire/formulaire.css';
import type { Langue } from '@/lib/formulaire/i18n';
import type { Reponses } from '@/lib/formulaire/types';
import { construireFiche } from '@/lib/formulaire/ficheRecherche';
import { DEMANDE_EXEMPLE_CAFE } from '@/lib/exemples';

type Vue = { nom: 'formulaire' } | { nom: 'fiche'; reponses: Reponses; exemple: boolean };

function Demo() {
  const [langue, setLangue] = useState<Langue>('fr');
  const [vue, setVue] = useState<Vue>({ nom: 'formulaire' });
  const fr = langue === 'fr';
  const aller = (v: Vue) => { setVue(v); window.scrollTo(0, 0); };
  return (
    <div lang={fr ? 'fr-CA' : 'en-CA'}>
      <p className="bandeau-demo">
        {fr ? 'Démo : vos réponses restent sur cet appareil. Aucun courriel n’est envoyé.' : 'Demo: your answers stay on this device. No email is sent.'}
      </p>
      <nav className="bascule-vues" aria-label={fr ? 'Vues de la démo' : 'Demo views'}>
        <button type="button" className={`bouton ${vue.nom === 'formulaire' ? 'bouton-principal' : 'bouton-secondaire'}`} aria-pressed={vue.nom === 'formulaire'} onClick={() => aller({ nom: 'formulaire' })}>
          {fr ? 'Formulaire client' : 'Client form'}
        </button>
        <button type="button" className={`bouton ${vue.nom === 'fiche' ? 'bouton-principal' : 'bouton-secondaire'}`} aria-pressed={vue.nom === 'fiche'} onClick={() => aller({ nom: 'fiche', reponses: DEMANDE_EXEMPLE_CAFE, exemple: true })}>
          {fr ? 'Fiche de recherche (agence)' : 'Search sheet (agency)'}
        </button>
      </nav>
      {vue.nom === 'formulaire' ? (
        <Formulaire langue={langue} mode="locale" cheminAutreLangue="" changerLangue={() => setLangue((l) => (l === 'fr' ? 'en' : 'fr'))} voirFiche={(r) => aller({ nom: 'fiche', reponses: r, exemple: false })} />
      ) : (
        <div lang="fr-CA"><FicheRecherche fiche={construireFiche(vue.reponses)} exemple={vue.exemple} numero={vue.exemple ? undefined : 'CEM-DEMO'} /></div>
      )}
    </div>
  );
}

createRoot(document.getElementById('racine')!).render(<StrictMode><Demo /></StrictMode>);
