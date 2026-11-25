import '@/components/formulaire/formulaire.css';

export const metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div lang="fr-CA">{children}</div>;
}
