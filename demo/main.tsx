import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Formulaire } from '@/components/formulaire/Formulaire';
import '@/components/formulaire/formulaire.css';
import type { Langue } from '@/lib/formulaire/i18n';

function Demo() {
  const [langue, setLangue] = useState<Langue>('fr');
  return (
    <div lang={langue === 'fr' ? 'fr-CA' : 'en-CA'}>
      <p className="bandeau-demo">
        {langue === 'fr'
          ? 'Démo : vos réponses restent sur cet appareil. Aucun courriel n’est envoyé.'
          : 'Demo: your answers stay on this device. No email is sent.'}
      </p>
      <Formulaire langue={langue} mode="locale" cheminAutreLangue="" changerLangue={() => setLangue((l) => (l === 'fr' ? 'en' : 'fr'))} />
    </div>
  );
}

createRoot(document.getElementById('racine')!).render(<StrictMode><Demo /></StrictMode>);
