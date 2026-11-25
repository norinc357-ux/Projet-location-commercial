import Link from 'next/link';
import { depot } from '@/lib/serveur/depot';
import { construireFiche, NIVEAUX as NIVEAU } from '@/lib/formulaire/ficheRecherche';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Demandes reçues | Agence' };



export default async function Page() {
  const demandes = await depot.listerSoumises();
  return (
    <main className="fiche-liste">
      <h1 className="fiche-titre">Demandes reçues</h1>
      <p className="fiche-resume">Triées par priorité. Ouvrez une demande pour sa fiche de recherche.</p>
      {demandes.length === 0 ? (
        <p className="fiche-vide">Aucune demande pour l’instant.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Score</th><th>Dossier</th><th>Entreprise</th><th>Recherche</th><th>Reçue</th></tr></thead>
            <tbody>
              {demandes.map((d) => {
                const f = construireFiche(d.reponses);
                const q = d.dossier!.qualification;
                return (
                  <tr key={d.jeton}>
                    <td className="nombre">{q.score} <span className="fiche-aide">{NIVEAU[q.niveau]}</span></td>
                    <td><Link href={`/agence/fiches/${d.dossier!.numero}`}>{d.dossier!.numero}</Link></td>
                    <td>{f.client.entreprise}</td>
                    <td>{f.resume}</td>
                    <td>{d.soumiseLe ? new Date(d.soumiseLe).toLocaleDateString('fr-CA', { timeZone: 'America/Toronto' }) : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
