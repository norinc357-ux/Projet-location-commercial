import type { Metadata } from 'next';
import { Formulaire } from '@/components/formulaire/Formulaire';

export const metadata: Metadata = {
  title: 'Décrire mon projet | Clé en main Commercial',
  description: 'Décrivez votre projet de local commercial en 10 minutes. On s’occupe de la recherche, des visites, de la négociation et du bail.',
  alternates: { languages: { 'fr-CA': '/decrire-mon-projet', 'en-CA': '/en/describe-my-project' } },
};

export default function Page() {
  return <Formulaire langue="fr" mode="api" cheminAutreLangue="/en/describe-my-project" />;
}
