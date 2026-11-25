import type { Metadata } from 'next';
import { Formulaire } from '@/components/formulaire/Formulaire';

export const metadata: Metadata = {
  title: 'Describe my project | Clé en main Commercial',
  description: 'Describe your commercial space project in 10 minutes. We handle the search, visits, negotiation and lease.',
  alternates: { languages: { 'fr-CA': '/decrire-mon-projet', 'en-CA': '/en/describe-my-project' } },
};

export default function Page() {
  return (
    <div lang="en-CA">
      <Formulaire langue="en" mode="api" cheminAutreLangue="/decrire-mon-projet" />
    </div>
  );
}
