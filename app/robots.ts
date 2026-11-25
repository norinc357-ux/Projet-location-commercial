import type { MetadataRoute } from 'next';
import { URL_SITE } from '@/lib/site/meta';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/agence', '/api', '/connexion', '/en/login'] }, sitemap: `${URL_SITE}/sitemap.xml` };
}
