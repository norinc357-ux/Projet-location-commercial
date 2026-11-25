import { AGENCE } from '@/lib/config';
import type { Langue } from '@/lib/formulaire/i18n';
import { URL_SITE } from '@/lib/site/meta';

/** Données structurées pour le référencement local (Google). */
export function JsonLdAgence({ langue }: { langue: Langue }) {
  const donnees = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: AGENCE.nom,
    url: `${URL_SITE}${langue === 'fr' ? '/' : '/en'}`,
    telephone: AGENCE.telephoneLien,
    email: AGENCE.courriel,
    address: { '@type': 'PostalAddress', streetAddress: AGENCE.adresse.rue, addressLocality: 'Montréal', addressRegion: 'QC', postalCode: AGENCE.adresse.codePostal, addressCountry: 'CA' },
    areaServed: ['Montréal', 'Laval', 'Longueuil', 'Rive-Sud', 'Rive-Nord'],
    knowsLanguage: ['fr-CA', 'en-CA'],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees).replace(/</g, '\\u003c') }} />;
}
