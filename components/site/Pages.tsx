import { ArrowRight, CalendarCheck, ClipboardList, Handshake, KeyRound, PhoneCall, SearchCheck, ShieldCheck, Clock, MessageSquareText, FileSignature, MapPin, Mail, Phone } from 'lucide-react';
import { AGENCE } from '@/lib/config';
import type { Langue } from '@/lib/formulaire/i18n';
import type { TypeLocal } from '@/lib/formulaire/types';
import { TYPES_LOCAL, FOURCHETTES_MARCHE } from '@/lib/formulaire/referentiels';
import { LEXIQUE } from '@/lib/formulaire/lexique';
import { Icone } from '@/components/formulaire/icones';
import { CONTENU_TYPES } from '@/lib/site/typesLocaux';
import { lien, lienType } from '@/lib/site/liens';
import { Lien } from './Lien';
import { FormulaireContact } from './FormulaireContact';

type P = { langue: Langue };
const choisir = (l: Langue) => (fr: string, en: string) => (l === 'fr' ? fr : en);

/* ---------- Morceaux réutilisables ---------- */

function AppelAction({ langue, titre, texte }: P & { titre?: string; texte?: string }) {
  const x = choisir(langue);
  return (
    <section className="bande bande-marine">
      <div className="conteneur cta-final">
        <h2>{titre ?? x('Prêt à trouver votre local ?', 'Ready to find your space?')}</h2>
        <p>{texte ?? x('Dix minutes pour décrire votre projet. Ensuite, on s’occupe du reste.', 'Ten minutes to describe your project. Then we handle the rest.')}</p>
        <Lien href={lien('formulaire', langue)} className="bouton bouton-or">{x('Décrire mon projet', 'Describe my project')} <ArrowRight size={18} aria-hidden="true" /></Lien>
      </div>
    </section>
  );
}

function EnTetePage({ surtitre, titre, intro }: { surtitre?: string; titre: string; intro?: string }) {
  return (
    <header className="site-entete-page">
      <div className="conteneur">
        {surtitre && <p className="surtitre">{surtitre}</p>}
        <h1>{titre}</h1>
        {intro && <p className="chapeau">{intro}</p>}
      </div>
    </header>
  );
}

const ETAPES_COURTES = [
  { icone: ClipboardList, fr: ['Vous décrivez votre projet', '10 minutes, une seule fois, sur votre cellulaire ou votre ordinateur.'], en: ['You describe your project', '10 minutes, just once, on your phone or computer.'] },
  { icone: PhoneCall, fr: ['On en parle 20 minutes', 'Un appel pour bien comprendre vos besoins et vos priorités.'], en: ['We talk for 20 minutes', 'A call to fully understand your needs and priorities.'] },
  { icone: SearchCheck, fr: ['Vous recevez 3 à 5 locaux', 'En 48 à 72 h ouvrables, chacun avec son score de correspondance.'], en: ['You receive 3 to 5 spaces', 'Within 48 to 72 business hours, each with a match score.'] },
  { icone: Handshake, fr: ['On visite et on négocie', 'On vous accompagne aux visites et on négocie le loyer et les conditions.'], en: ['We tour and negotiate', 'We go to the tours with you and negotiate rent and terms.'] },
  { icone: KeyRound, fr: ['Vous recevez les clés', 'Documents, signature électronique, remise des clés et suivi.'], en: ['You get the keys', 'Paperwork, e-signature, key handover and follow-up.'] },
];

function Etapes({ langue }: P) {
  return (
    <ol className="etapes">
      {ETAPES_COURTES.map((e, i) => {
        const [titre, texte] = e[langue];
        const I = e.icone;
        return (
          <li key={titre} className="etape">
            <span className="etape-icone"><I aria-hidden="true" /></span>
            <span className="etape-numero" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{titre}</h3>
            <p>{texte}</p>
          </li>
        );
      })}
    </ol>
  );
}

function GrilleTypes({ langue }: P) {
  return (
    <ul className="grille-types">
      {TYPES_LOCAL.map((t) => (
        <li key={t.valeur}>
          <Lien href={lienType(t.valeur, langue)} className="carte-type">
            <span className="carte-type-icone"><Icone nom={t.icone} taille={26} /></span>
            <span className="carte-type-titre">{t.libelle[langue]}</span>
            <span className="carte-type-texte">{t.description?.[langue]}</span>
            <ArrowRight className="carte-type-fleche" size={18} aria-hidden="true" />
          </Lien>
        </li>
      ))}
    </ul>
  );
}

type QR = { q: [string, string]; r: [string, string] };
const FAQ: QR[] = [
  {
    q: ['Combien coûte votre service ?', 'How much does your service cost?'],
    r: [
      'Dans la plupart des locations commerciales, la rémunération du courtier est payée par le propriétaire. Si ce n’est pas le cas pour votre dossier, on vous le dit par écrit avant toute démarche, avec le montant.',
      'In most commercial leases, the broker’s fee is paid by the landlord. If that is not the case for your file, we tell you in writing, with the amount, before doing anything.',
    ],
  },
  {
    q: ['Je ne connais rien aux baux commerciaux. Est-ce un problème ?', 'I know nothing about commercial leases. Is that a problem?'],
    r: [
      'Pas du tout. C’est notre travail. Chaque terme est expliqué dans le formulaire, et on passe le bail en revue avec vous, clause par clause, avant la signature.',
      'Not at all. That is our job. Every term is explained in the form, and we go through the lease with you, clause by clause, before you sign.',
    ],
  },
  {
    q: ['Dans quels secteurs travaillez-vous ?', 'Which areas do you cover?'],
    r: [
      'Montréal et ses environs : île de Montréal, Laval, Longueuil et la Rive-Sud, la Rive-Nord. Pour un autre secteur, demandez-nous.',
      'Montréal and surrounding areas: the island of Montréal, Laval, Longueuil and the South Shore, the North Shore. For other areas, just ask.',
    ],
  },
  {
    q: ['Combien de temps faut-il pour trouver un local ?', 'How long does it take to find a space?'],
    r: [
      'Vous recevez une première sélection en 48 à 72 h ouvrables après l’appel découverte. De la demande aux clés, comptez souvent 1 à 4 mois selon le type de local et les travaux.',
      'You get a first shortlist within 48 to 72 business hours after the discovery call. From request to keys, plan on 1 to 4 months depending on the space and the work needed.',
    ],
  },
  {
    q: ['J’ai déjà repéré un local. Pouvez-vous m’aider ?', 'I have already found a space. Can you help?'],
    r: [
      'Oui. Ajoutez le lien dans le formulaire. On vérifie le zonage, le coût total réel et les clauses, puis on négocie pour vous.',
      'Yes. Add the link in the form. We check zoning, the real total cost and the clauses, then negotiate for you.',
    ],
  },
  {
    q: ['Que faites-vous de mes renseignements ?', 'What do you do with my information?'],
    r: [
      'Ils servent uniquement à votre recherche de local, sont hébergés au Canada et ne sont jamais vendus. Vous pouvez demander à les consulter ou à les effacer en tout temps.',
      'They are used only for your space search, hosted in Canada and never sold. You can ask to see or delete them at any time.',
    ],
  },
];

function Faq({ langue, nombre }: P & { nombre?: number }) {
  const i = langue === 'fr' ? 0 : 1;
  return (
    <div className="faq">
      {FAQ.slice(0, nombre ?? FAQ.length).map((f) => (
        <details key={f.q[0]}>
          <summary>{f.q[i]}</summary>
          <p>{f.r[i]}</p>
        </details>
      ))}
    </div>
  );
}

/* ---------- Accueil ---------- */

export function PageAccueil({ langue }: P) {
  const x = choisir(langue);
  return (
    <>
      <section className="heros">
        <div className="conteneur heros-grille">
          <div>
            <p className="surtitre">{x('Location de locaux commerciaux · Montréal', 'Commercial space leasing · Montréal')}</p>
            <h1>{x('Dites-nous ce que vous cherchez. On s’occupe du reste, jusqu’aux clés.', 'Tell us what you need. We handle the rest, right up to the keys.')}</h1>
            <p className="chapeau">
              {x(
                'Bureau, boutique, restaurant, entrepôt ou clinique : vous décrivez votre projet une seule fois. On cherche, on visite, on négocie et on s’occupe de la paperasse.',
                'Office, shop, restaurant, warehouse or clinic: you describe your project once. We search, tour, negotiate and handle the paperwork.',
              )}
            </p>
            <div className="heros-actions">
              <Lien href={lien('formulaire', langue)} className="bouton bouton-principal bouton-grand">{x('Décrire mon projet', 'Describe my project')} <ArrowRight size={18} aria-hidden="true" /></Lien>
              <Lien href={lien('commentCaMarche', langue)} className="bouton bouton-secondaire bouton-grand">{x('Comment ça marche', 'How it works')}</Lien>
            </div>
            <ul className="heros-garanties">
              <li><Clock size={18} aria-hidden="true" /> {x('10 minutes pour décrire votre projet', '10 minutes to describe your project')}</li>
              <li><SearchCheck size={18} aria-hidden="true" /> {x('3 à 5 locaux en 48 à 72 h ouvrables', '3 to 5 spaces in 48 to 72 business hours')}</li>
              <li><ShieldCheck size={18} aria-hidden="true" /> {x('Vos données restent au Canada', 'Your data stays in Canada')}</li>
            </ul>
          </div>
          <div className="heros-visuel" aria-hidden="true">
            <div className="heros-carte">
              <p className="heros-carte-surtitre">{x('Votre dossier', 'Your file')}</p>
              <p className="heros-carte-titre">{x('Café-boulangerie, Mile End', 'Café-bakery, Mile End')}</p>
              <ul className="heros-ligne">
                <li className="fait">{x('Demande reçue', 'Request received')}</li>
                <li className="fait">{x('Appel découverte', 'Discovery call')}</li>
                <li className="fait">{x('Sélection envoyée', 'Shortlist sent')}</li>
                <li className="encours">{x('Visites', 'Tours')}</li>
                <li>{x('Négociation', 'Negotiation')}</li>
                <li>{x('Remise des clés', 'Key handover')}</li>
              </ul>
              <div className="heros-local">
                <span>{x('Local B · 1 450 pi²', 'Space B · 1,450 sq. ft.')}</span>
                <strong>{x('92 % de correspondance', '92% match')}</strong>
              </div>
              <p className="heros-carte-note">{x('Exemple illustratif', 'Illustrative example')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bande">
        <div className="conteneur">
          <h2 className="titre-section">{x('Cinq étapes, une seule personne pour vous guider', 'Five steps, one person to guide you')}</h2>
          <Etapes langue={langue} />
        </div>
      </section>

      <section className="bande bande-claire">
        <div className="conteneur">
          <h2 className="titre-section">{x('Quel type de local cherchez-vous ?', 'What kind of space are you looking for?')}</h2>
          <p className="sous-titre-section">{x('Chaque type a ses pièges. On les connaît.', 'Every type has its pitfalls. We know them.')}</p>
          <GrilleTypes langue={langue} />
        </div>
      </section>

      <section className="bande">
        <div className="conteneur">
          <h2 className="titre-section">{x('Ce qu’on fait à votre place', 'What we do for you')}</h2>
          <ul className="avantages">
            {[
              [SearchCheck, x('La recherche', 'The search'), x('Annonces publiques, réseau de propriétaires et locaux pas encore affichés.', 'Public listings, our landlord network and spaces not yet advertised.')],
              [CalendarCheck, x('Les visites', 'The tours'), x('Planifiées dans votre calendrier, avec nous sur place pour poser les bonnes questions.', 'Booked in your calendar, with us on site to ask the right questions.')],
              [Handshake, x('La négociation', 'The negotiation'), x('Loyer, période gratuite, améliorations locatives, clauses : on défend vos intérêts.', 'Rent, free period, tenant improvements, clauses: we defend your interests.')],
              [FileSignature, x('La paperasse', 'The paperwork'), x('Documents pré-remplis, suivi en ligne et signature électronique.', 'Pre-filled documents, online tracking and e-signature.')],
            ].map(([I, titre, texte]) => {
              const Ic = I as typeof SearchCheck;
              return (
                <li key={titre as string}>
                  <Ic aria-hidden="true" />
                  <h3>{titre as string}</h3>
                  <p>{texte as string}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bande bande-claire">
        <div className="conteneur">
          <h2 className="titre-section">{x('En chiffres', 'By the numbers')}</h2>
          <ul className="chiffres">
            {[x('baux signés', 'leases signed'), x('jours en moyenne jusqu’aux clés', 'average days to keys'), x('de clients satisfaits', 'client satisfaction'), x('années d’expérience', 'years of experience')].map((l) => (
              <li key={l} className="reserve">
                <span className="chiffre">—</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <p className="note-reserve">{x('Espaces réservés : les vrais chiffres de l’agence seront ajoutés ici.', 'Placeholders: the agency’s real figures will go here.')}</p>

          <h2 className="titre-section titre-espace">{x('Ils nous ont fait confiance', 'Clients who trusted us')}</h2>
          <ul className="temoignages">
            {[1, 2, 3].map((n) => (
              <li key={n} className="reserve">
                <p>{x('Espace réservé pour un vrai témoignage de client, publié avec sa permission écrite.', 'Placeholder for a real client testimonial, published with written permission.')}</p>
                <span>{x('Nom, entreprise, type de local', 'Name, company, type of space')}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bande">
        <div className="conteneur conteneur-etroit">
          <h2 className="titre-section">{x('Questions fréquentes', 'Frequently asked questions')}</h2>
          <Faq langue={langue} nombre={4} />
          <p className="lien-suite"><Lien href={lien('commentCaMarche', langue)}>{x('Toutes les questions et le parcours détaillé', 'All questions and the detailed process')}</Lien></p>
        </div>
      </section>

      <AppelAction langue={langue} />
    </>
  );
}

/* ---------- Comment ça marche ---------- */

const PARCOURS: { qui: 'vous' | 'nous' | 'ensemble'; delai: [string, string]; titre: [string, string]; texte: [string, string] }[] = [
  { qui: 'vous', delai: ['10 minutes', '10 minutes'], titre: ['Vous décrivez votre projet', 'You describe your project'], texte: ['Type de local, secteurs, superficie, budget, priorités. Le formulaire s’adapte à votre type de local et sauvegarde vos réponses au fur et à mesure.', 'Type of space, areas, size, budget, priorities. The form adapts to your type of space and saves as you go.'] },
  { qui: 'vous', delai: ['1 minute', '1 minute'], titre: ['Vous réservez l’appel découverte', 'You book the discovery call'], texte: ['Directement à la fin du formulaire, au moment qui vous convient.', 'Right at the end of the form, at a time that suits you.'] },
  { qui: 'nous', delai: ['Tout de suite', 'Right away'], titre: ['Vous recevez la confirmation', 'You get a confirmation'], texte: ['Un courriel avec le résumé de votre demande et l’accès à votre espace client.', 'An email with a summary of your request and access to your client portal.'] },
  { qui: 'ensemble', delai: ['20 minutes', '20 minutes'], titre: ['L’appel découverte', 'The discovery call'], texte: ['On précise ce qui est vraiment obligatoire, ce qui est souhaitable et ce qui ne marchera pas.', 'We clarify what is truly required, what is nice to have and what will not work.'] },
  { qui: 'nous', delai: ['48 à 72 h ouvrables', '48 to 72 business hours'], titre: ['On vous envoie 3 à 5 locaux', 'We send you 3 to 5 spaces'], texte: ['Chacun avec le coût total mensuel estimé et un score de correspondance expliqué : « Correspond à 9 de vos 10 critères, il manque le stationnement. »', 'Each with the estimated total monthly cost and an explained match score: “Matches 9 of your 10 criteria; missing: parking.”'] },
  { qui: 'vous', delai: ['À votre rythme', 'At your pace'], titre: ['Vous réagissez à chaque local', 'You react to each space'], texte: ['J’aime, pas pour moi, une question : un clic suffit. Vous pouvez inviter un associé à décider avec vous.', 'Like, not for me, a question: one click is enough. You can invite a partner to decide with you.'] },
  { qui: 'ensemble', delai: ['1 à 2 semaines', '1 to 2 weeks'], titre: ['Les visites', 'The tours'], texte: ['Planifiées dans votre calendrier, avec rappels. On vous accompagne et on vérifie la technique sur place.', 'Booked in your calendar, with reminders. We go with you and check the technical side on site.'] },
  { qui: 'nous', delai: ['1 à 4 semaines', '1 to 4 weeks'], titre: ['Offre et négociation', 'Offer and negotiation'], texte: ['On rédige la lettre d’intention et on négocie. Vous suivez chaque échange en temps réel dans votre espace client.', 'We draft the letter of intent and negotiate. You follow every exchange in real time in your client portal.'] },
  { qui: 'ensemble', delai: ['1 à 3 semaines', '1 to 3 weeks'], titre: ['Documents et signature', 'Documents and signing'], texte: ['Une liste claire des documents à fournir, des formulaires déjà remplis et la signature électronique du bail.', 'A clear list of documents to provide, forms already filled in and e-signature of the lease.'] },
  { qui: 'nous', delai: ['Le jour J', 'Move-in day'], titre: ['Remise des clés et suivi', 'Key handover and follow-up'], texte: ['On est là pour la remise des clés, puis on fait un suivi après l’emménagement.', 'We are there for the key handover, then follow up after you move in.'] },
];

export function PageCommentCaMarche({ langue }: P) {
  const x = choisir(langue);
  const i = langue === 'fr' ? 0 : 1;
  const QUI = { vous: x('Vous', 'You'), nous: x('Nous', 'Us'), ensemble: x('Ensemble', 'Together') };
  return (
    <>
      <EnTetePage
        surtitre={x('Le parcours', 'The process')}
        titre={x('Comment ça marche', 'How it works')}
        intro={x('Vous décrivez votre besoin une fois. Voici exactement ce qui se passe ensuite, qui fait quoi et en combien de temps.', 'You describe your needs once. Here is exactly what happens next, who does what, and how long it takes.')}
      />
      <section className="bande">
        <div className="conteneur conteneur-etroit">
          <ol className="parcours">
            {PARCOURS.map((e, n) => (
              <li key={e.titre[0]} className="parcours-etape">
                <span className="parcours-numero" aria-hidden="true">{n + 1}</span>
                <div>
                  <p className="parcours-meta">
                    <span className={`qui qui-${e.qui}`}>{QUI[e.qui]}</span>
                    <span className="delai"><Clock size={14} aria-hidden="true" /> {e.delai[i]}</span>
                  </p>
                  <h2>{e.titre[i]}</h2>
                  <p>{e.texte[i]}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="encadre-site">
            <h2>{x('Ce que vous voyez dans votre espace client', 'What you see in your client portal')}</h2>
            <p>{x('Où en est votre dossier, la prochaine action à faire, les locaux proposés, vos visites, vos documents et vos échanges avec votre agent. Vous ne vous demandez jamais où on en est.', 'Where your file stands, your next step, proposed spaces, tours, documents and messages with your agent. You never have to wonder where things are.')}</p>
          </div>
        </div>
      </section>
      <section className="bande bande-claire">
        <div className="conteneur conteneur-etroit">
          <h2 className="titre-section">{x('Questions fréquentes', 'Frequently asked questions')}</h2>
          <Faq langue={langue} />
        </div>
      </section>
      <AppelAction langue={langue} />
    </>
  );
}

/* ---------- Types de locaux ---------- */

export function PageTypes({ langue }: P) {
  const x = choisir(langue);
  return (
    <>
      <EnTetePage
        surtitre={x('Types de locaux', 'Space types')}
        titre={x('Un local commercial pour chaque projet', 'A commercial space for every project')}
        intro={x('Chaque type de local a ses points techniques et ses pièges. Choisissez le vôtre pour savoir quoi vérifier avant de signer.', 'Every type of space has its technical points and pitfalls. Choose yours to see what to check before you sign.')}
      />
      <section className="bande">
        <div className="conteneur"><GrilleTypes langue={langue} /></div>
      </section>
      <AppelAction langue={langue} />
    </>
  );
}

export function PageTypeLocal({ langue, type }: P & { type: TypeLocal }) {
  const x = choisir(langue);
  const c = CONTENU_TYPES[type];
  const info = TYPES_LOCAL.find((t) => t.valeur === type)!;
  const [min, max] = FOURCHETTES_MARCHE[type];
  return (
    <>
      <EnTetePage surtitre={info.libelle[langue]} titre={c.titre[langue]} intro={c.accroche[langue]} />
      <section className="bande">
        <div className="conteneur grille-article">
          <div className="article">
            <h2>{x('Pour qui', 'Who it is for')}</h2>
            <p>{c.pourQui[langue]}</p>

            <h2>{x('Ce qu’on vérifie pour vous', 'What we check for you')}</h2>
            <ul className="points">
              {c.points.map((p) => (
                <li key={p.titre.fr}>
                  <h3>{p.titre[langue]}</h3>
                  <p>{p.texte[langue]}</p>
                </li>
              ))}
            </ul>

            <h2>{x('Les erreurs qu’on vous évite', 'Mistakes we help you avoid')}</h2>
            <ul className="pieges">{c.pieges.map((p) => <li key={p.fr}>{p[langue]}</li>)}</ul>
          </div>
          <aside className="article-cote">
            <div className="encadre-site">
              <h2>{x('Repères', 'Benchmarks')}</h2>
              <dl className="reperes">
                <div><dt>{x('Loyer typique', 'Typical rent')}</dt><dd>{x(`${min} à ${max} $ le pi² par année, tout compris`, `$${min} to $${max} per sq. ft. per year, all in`)}</dd></div>
                <div><dt>{x('Délai typique', 'Typical timeline')}</dt><dd>{c.delai[langue]}</dd></div>
              </dl>
              <p className="note-reserve">{x('Ordres de grandeur pour le Grand Montréal, à titre indicatif. Ils varient beaucoup selon le secteur et l’état du local.', 'Rough ranges for Greater Montréal, for guidance only. They vary widely by area and condition.')}</p>
            </div>
            <div className="encadre-site">
              <h2>{x('Termes utiles', 'Useful terms')}</h2>
              <dl className="termes">
                {c.termes.map((k) => (
                  <div key={k}><dt>{LEXIQUE[k].terme[langue]}</dt><dd>{LEXIQUE[k].definition[langue]}</dd></div>
                ))}
              </dl>
              <p><Lien href={`${lien('guide', langue)}#lexique`}>{x('Tout le lexique', 'Full glossary')}</Lien></p>
            </div>
          </aside>
        </div>
      </section>
      <AppelAction
        langue={langue}
        titre={x(`Vous cherchez un local de type ${info.libelle.fr.toLowerCase()} ?`, `Looking for ${info.libelle.en.toLowerCase()} space?`)}
        texte={x('Le formulaire vous pose les bonnes questions pour ce type de local. Dix minutes, et on s’occupe du reste.', 'The form asks the right questions for this type of space. Ten minutes, and we handle the rest.')}
      />
    </>
  );
}

/* ---------- Guide du locataire ---------- */

export function PageGuide({ langue }: P) {
  const x = choisir(langue);
  const sections = [
    { id: 'baux', titre: x('Bail brut, net ou triple net', 'Gross, net or triple net lease') },
    { id: 'frais', titre: x('Les frais d’exploitation', 'Operating costs') },
    { id: 'calcul', titre: x('Calculer le coût total', 'Working out the total cost') },
    { id: 'depot', titre: x('Dépôt et garantie personnelle', 'Deposit and personal guarantee') },
    { id: 'ameliorations', titre: x('Améliorations locatives et période gratuite', 'Tenant improvements and free rent') },
    { id: 'clauses', titre: x('Les clauses à surveiller', 'Clauses to watch') },
    { id: 'lexique', titre: x('Lexique', 'Glossary') },
  ];
  const termes = Object.values(LEXIQUE).sort((a, b) => a.terme[langue].localeCompare(b.terme[langue], langue === 'fr' ? 'fr-CA' : 'en-CA'));
  return (
    <>
      <EnTetePage
        surtitre={x('Guide du locataire', 'Tenant guide')}
        titre={x('Comprendre un bail commercial au Québec', 'Understanding a commercial lease in Québec')}
        intro={x('L’essentiel, en mots simples, pour signer en connaissant le vrai coût et les vrais risques.', 'The essentials, in plain words, so you sign knowing the real cost and the real risks.')}
      />
      <section className="bande">
        <div className="conteneur grille-article">
          <nav className="sommaire" aria-label={x('Sommaire', 'Contents')}>
            <p className="sommaire-titre">{x('Sommaire', 'Contents')}</p>
            <ol>{sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.titre}</a></li>)}</ol>
          </nav>
          <div className="article">
            <h2 id="baux">{sections[0].titre}</h2>
            <p>{x('Au Québec, le bail commercial est surtout régi par ce que vous signez : contrairement au bail résidentiel, il n’y a pas de Tribunal administratif du logement pour fixer le loyer. Le type de bail détermine qui paie quoi.', 'In Québec, a commercial lease is governed mostly by what you sign: unlike residential leases, no tribunal sets the rent. The type of lease decides who pays what.')}</p>
            <div className="tableau-defilant" tabIndex={0} role="region" aria-label={x("Tableau : qui paie quoi", "Table: who pays what")}>
              <table className="tableau">
                <caption className="sr-only">{x('Qui paie quoi selon le type de bail', 'Who pays what by lease type')}</caption>
                <thead>
                  <tr><th scope="col">{x('Dépense', 'Expense')}</th><th scope="col">{x('Brut', 'Gross')}</th><th scope="col">{x('Net', 'Net')}</th><th scope="col">{x('Triple net', 'Triple net')}</th></tr>
                </thead>
                <tbody>
                  {[
                    [x('Loyer de base', 'Base rent'), 'L', 'L', 'L'],
                    [x('Taxes foncières', 'Property taxes'), 'P', 'L', 'L'],
                    [x('Assurance de l’immeuble', 'Building insurance'), 'P', x('Variable', 'Varies'), 'L'],
                    [x('Entretien et réparations', 'Maintenance and repairs'), 'P', 'P', 'L'],
                    [x('Électricité et chauffage du local', 'Unit electricity and heating'), x('Variable', 'Varies'), 'L', 'L'],
                  ].map(([d, ...c]) => (
                    <tr key={d}><th scope="row">{d}</th>{c.map((v, n) => <td key={n}>{v === 'L' ? x('Locataire', 'Tenant') : v === 'P' ? x('Propriétaire', 'Landlord') : v}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note-reserve">{x('Les termes varient d’un propriétaire à l’autre. Seul le texte du bail compte : on le lit avec vous.', 'Terms vary from one landlord to another. Only the lease text counts: we read it with you.')}</p>

            <h2 id="frais">{sections[1].titre}</h2>
            <p>{x('Aussi appelés frais communs ou « CAM » (common area maintenance). Ils couvrent l’entretien des aires communes, le déneigement, la sécurité, la gestion et souvent les taxes foncières. Ils sont estimés au début de l’année, puis ajustés selon les dépenses réelles.', 'Also called common area maintenance (CAM). They cover upkeep of common areas, snow removal, security, management and often property taxes. They are estimated at the start of the year, then adjusted to actual costs.')}</p>
            <ul>
              <li>{x('Demandez l’historique des trois dernières années.', 'Ask for the last three years of history.')}</li>
              <li>{x('Vérifiez si les frais de gestion sont plafonnés (souvent 10 à 15 %).', 'Check whether management fees are capped (often 10 to 15%).')}</li>
              <li>{x('Excluez les grosses réparations du bâtiment (toiture, structure) quand c’est possible.', 'Exclude major building repairs (roof, structure) where possible.')}</li>
            </ul>

            <h2 id="calcul">{sections[2].titre}</h2>
            <p>{x('Les loyers sont annoncés au pied carré par année. Voici comment passer au coût mensuel réel :', 'Rents are quoted per square foot per year. Here is how to get to the real monthly cost:')}</p>
            <div className="calcul">
              <p className="calcul-titre">{x('Exemple : 1 500 pi², bail net', 'Example: 1,500 sq. ft., net lease')}</p>
              <dl>
                <div><dt>{x('Loyer de base : 24 $ × 1 500 pi²', 'Base rent: $24 × 1,500 sq. ft.')}</dt><dd>{x('36 000 $ / an', '$36,000 / yr')}</dd></div>
                <div><dt>{x('Frais d’exploitation et taxes : 14 $ × 1 500 pi²', 'Operating costs and taxes: $14 × 1,500 sq. ft.')}</dt><dd>{x('21 000 $ / an', '$21,000 / yr')}</dd></div>
                <div className="calcul-total"><dt>{x('Total avant TPS et TVQ', 'Total before GST and QST')}</dt><dd>{x('57 000 $ / an, soit 4 750 $ / mois', '$57,000 / yr, or $4,750 / month')}</dd></div>
              </dl>
              <p className="note-reserve">{x('Chiffres fictifs, à titre d’exemple. Le loyer commercial est taxable : la TPS et la TVQ s’ajoutent.', 'Sample figures. Commercial rent is taxable: GST and QST are added.')}</p>
            </div>

            <h2 id="depot">{sections[3].titre}</h2>
            <p>{x('Le propriétaire demande souvent un dépôt de 1 à 3 mois de loyer, plus pour une entreprise en démarrage. Il peut aussi demander une garantie personnelle : vous vous engagez personnellement si l’entreprise ne paie pas. Tout cela se négocie : montant, durée, réduction après quelques années de bon paiement.', 'Landlords often ask for a deposit of 1 to 3 months’ rent, more for a start-up. They may also ask for a personal guarantee: you are personally liable if the company does not pay. All of this is negotiable: amount, duration, reduction after a few years of on-time payment.')}</p>

            <h2 id="ameliorations">{sections[4].titre}</h2>
            <p>{x('Les améliorations locatives sont les travaux pour adapter le local à votre activité. Le propriétaire peut en payer une partie (une allocation au pied carré) ou les faire lui-même. Il peut aussi offrir quelques mois sans loyer de base, souvent pendant les travaux. Ces deux leviers valent parfois plus qu’une baisse de loyer.', 'Tenant improvements are the work needed to adapt the space to your business. The landlord may pay part of it (an allowance per square foot) or do the work. They may also offer a few months without base rent, often during the work. These two levers are sometimes worth more than a rent cut.')}</p>

            <h2 id="clauses">{sections[5].titre}</h2>
            <ul className="points">
              {[
                [x('Renouvellement', 'Renewal'), x('Avez-vous une option de renouvellement, et à quel loyer ? Sans option, le propriétaire peut refuser.', 'Do you have a renewal option, and at what rent? Without one, the landlord can refuse.')],
                [x('Indexation', 'Escalation'), x('Hausses fixes chaque année ou selon l’inflation : faites le calcul sur toute la durée.', 'Fixed yearly increases or inflation-based: run the numbers over the full term.')],
                [x('Cession et sous-location', 'Assignment and subletting'), x('Pourrez-vous transférer le bail si vous vendez l’entreprise ou déménagez ?', 'Can you transfer the lease if you sell the business or move?')],
                [x('Remise en état', 'Restoration'), x('Devrez-vous démolir vos aménagements à la fin du bail ?', 'Will you have to remove your improvements at lease end?')],
                [x('Usage permis', 'Permitted use'), x('Un usage trop étroit vous empêche d’évoluer. Faites-le décrire assez largement.', 'A narrow use clause stops you from evolving. Have it written broadly enough.')],
                [x('Démolition ou relocalisation', 'Demolition or relocation'), x('Certains baux permettent au propriétaire de vous déplacer ou de mettre fin au bail. À négocier.', 'Some leases let the landlord move you or end the lease. Negotiate it.')],
              ].map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
            </ul>

            <h2 id="lexique">{sections[6].titre}</h2>
            <dl className="termes termes-lexique">
              {termes.map((tm) => <div key={tm.terme.fr}><dt>{tm.terme[langue]}</dt><dd>{tm.definition[langue]}</dd></div>)}
            </dl>
            <p className="note-reserve">{x('Ce guide donne de l’information générale, pas un avis juridique. Pour un bail précis, consultez un avocat ou un notaire.', 'This guide provides general information, not legal advice. For a specific lease, consult a lawyer or notary.')}</p>
          </div>
        </div>
      </section>
      <AppelAction langue={langue} titre={x('Vous préférez qu’on lise le bail pour vous ?', 'Would you rather we read the lease for you?')} />
    </>
  );
}

/* ---------- À propos ---------- */

export function PageAPropos({ langue }: P) {
  const x = choisir(langue);
  return (
    <>
      <EnTetePage
        surtitre={x('À propos', 'About')}
        titre={x('Une agence pensée pour les locataires', 'An agency built for tenants')}
        intro={x(`${AGENCE.nom} accompagne les entreprises de Montréal et des environs dans la location de leur local, du premier appel à la remise des clés.`, `${AGENCE.nom} helps businesses in and around Montréal lease their space, from first call to key handover.`)}
      />
      <section className="bande">
        <div className="conteneur conteneur-etroit article">
          <h2>{x('Nos engagements', 'Our commitments')}</h2>
          <ul className="points">
            {[
              [x('Le coût total, toujours', 'Total cost, always'), x('On vous montre le coût mensuel tout compris, pas seulement le loyer affiché.', 'We show you the all-in monthly cost, not just the asking rent.')],
              [x('Des explications simples', 'Plain explanations'), x('Aucun terme technique sans explication. Vous signez en sachant ce que vous signez.', 'No technical term without an explanation. You sign knowing what you sign.')],
              [x('Une seule personne', 'One person'), x('Un agent attitré suit votre dossier du début à la fin.', 'A dedicated agent follows your file from start to finish.')],
              [x('La transparence sur notre rémunération', 'Transparency about our fees'), x('Vous savez dès le départ qui nous paie et combien.', 'You know from the start who pays us and how much.')],
            ].map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </ul>

          <h2>{x('L’équipe', 'The team')}</h2>
          <ul className="equipe">
            {[1, 2, 3].map((n) => (
              <li key={n} className="reserve">
                <span className="equipe-photo" aria-hidden="true" />
                <strong>{x('Nom à compléter', 'Name to be added')}</strong>
                <span>{x('Courtier immobilier commercial', 'Commercial real estate broker')}</span>
              </li>
            ))}
          </ul>
          <p className="note-reserve">{x('Espaces réservés : photos et biographies de l’équipe à venir.', 'Placeholders: team photos and bios to come.')}</p>

          <h2>{x('Encadrement', 'Regulation')}</h2>
          <p>{x(`Nos courtiers sont titulaires d’un permis délivré par l’Organisme d’autoréglementation du courtage immobilier du Québec (OACIQ). Permis de l’agence : ${AGENCE.permisOaciq}.`, `Our brokers hold a licence issued by the Organisme d’autoréglementation du courtage immobilier du Québec (OACIQ). Agency licence: ${AGENCE.permisOaciq}.`)}</p>
        </div>
      </section>
      <AppelAction langue={langue} />
    </>
  );
}

/* ---------- Contact ---------- */

export function PageContact({ langue, envoyer }: P & { envoyer?: (d: Record<string, string>) => Promise<boolean> }) {
  const x = choisir(langue);
  return (
    <>
      <EnTetePage
        surtitre={x('Contact', 'Contact')}
        titre={x('Parlons de votre projet', 'Let’s talk about your project')}
        intro={x('Une question avant de commencer ? Écrivez-nous ou appelez-nous. On répond en moins d’un jour ouvrable.', 'A question before you start? Write or call us. We reply within one business day.')}
      />
      <section className="bande">
        <div className="conteneur grille-contact">
          <div>
            <div className="encadre-site encadre-or">
              <h2>{x('Vous cherchez un local ?', 'Looking for a space?')}</h2>
              <p>{x('Le formulaire est le plus rapide : vous décrivez votre projet et vous réservez votre appel découverte en même temps.', 'The form is fastest: you describe your project and book your discovery call at the same time.')}</p>
              <Lien href={lien('formulaire', langue)} className="bouton bouton-principal">{x('Décrire mon projet', 'Describe my project')}</Lien>
            </div>
            <ul className="coordonnees">
              <li><Phone aria-hidden="true" /><a href={`tel:${AGENCE.telephoneLien}`}>{AGENCE.telephone}</a></li>
              <li><Mail aria-hidden="true" /><a href={`mailto:${AGENCE.courriel}`}>{AGENCE.courriel}</a></li>
              <li><MapPin aria-hidden="true" /><span>{AGENCE.adresse.rue}<br />{AGENCE.adresse.ville} {AGENCE.adresse.codePostal}</span></li>
              <li><Clock aria-hidden="true" /><span>{AGENCE.heures[langue]}</span></li>
            </ul>
            <p className="note-reserve">{x('Coordonnées d’exemple, à remplacer.', 'Sample contact details, to be replaced.')}</p>
          </div>
          <div>
            <h2 className="titre-formulaire"><MessageSquareText aria-hidden="true" /> {x('Écrivez-nous', 'Write to us')}</h2>
            <FormulaireContact langue={langue} envoyer={envoyer} />
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Espace client (connexion) ---------- */

export function PageConnexion({ langue }: P) {
  const x = choisir(langue);
  return (
    <>
      <EnTetePage
        surtitre={x('Espace client', 'Client portal')}
        titre={x('Votre espace client', 'Your client portal')}
        intro={x('Suivez votre dossier, vos locaux proposés, vos visites et vos documents.', 'Follow your file, proposed spaces, tours and documents.')}
      />
      <section className="bande">
        <div className="conteneur conteneur-etroit">
          <div className="encadre-site">
            <h2>{x('Comment y accéder', 'How to access it')}</h2>
            <p>{x('Après l’envoi de votre demande, vous recevez un courriel avec un lien de connexion sécurisé. Pas de mot de passe à retenir.', 'After you send your request, you receive an email with a secure sign-in link. No password to remember.')}</p>
            <p>{x('Pas encore de dossier ?', 'No file yet?')} <Lien href={lien('formulaire', langue)}>{x('Décrivez votre projet', 'Describe your project')}</Lien>.</p>
            <p className="note-reserve">{x('La connexion à l’espace client sera ouverte à l’étape 4 du projet.', 'Client portal sign-in opens in step 4 of the project.')}</p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Politique de confidentialité ---------- */

export function PageConfidentialite({ langue }: P) {
  const x = choisir(langue);
  return (
    <>
      <EnTetePage
        surtitre={x('Loi 25', 'Law 25')}
        titre={x('Politique de confidentialité', 'Privacy policy')}
        intro={x('Comment nous recueillons, utilisons et protégeons vos renseignements personnels.', 'How we collect, use and protect your personal information.')}
      />
      <section className="bande">
        <div className="conteneur conteneur-etroit article">
          <p className="note-reserve">{x('Version préliminaire, à faire valider par un juriste avant la mise en ligne.', 'Draft version, to be reviewed by a lawyer before going live.')}</p>

          <h2>{x('Responsable', 'Person in charge')}</h2>
          <p>{x(`La personne responsable de la protection des renseignements personnels chez ${AGENCE.nom} est : ${AGENCE.responsableVieePrivee}. Joignez-la à ${AGENCE.courriel}.`, `The person in charge of personal information at ${AGENCE.nom} is: ${AGENCE.responsableVieePrivee}. Reach them at ${AGENCE.courriel}.`)}</p>

          <h2>{x('Ce que nous recueillons', 'What we collect')}</h2>
          <ul>
            <li>{x('Vos coordonnées : nom, entreprise, courriel, téléphone, langue.', 'Your contact details: name, company, email, phone, language.')}</li>
            <li>{x('Votre projet : type de local, secteurs, superficie, budget, dates, priorités et descriptions.', 'Your project: type of space, areas, size, budget, dates, priorities and descriptions.')}</li>
            <li>{x('Les documents que vous déposez pour la location (pièce d’identité, états financiers, etc.).', 'Documents you upload for the lease (ID, financial statements, etc.).')}</li>
            <li>{x('Des données techniques minimales (journal de sécurité, adresse IP) pour protéger le site.', 'Minimal technical data (security logs, IP address) to protect the site.')}</li>
          </ul>

          <h2>{x('Pourquoi', 'Why')}</h2>
          <p>{x('Uniquement pour trouver votre local, organiser les visites, négocier et préparer le bail, et pour communiquer avec vous à ce sujet. Nous ne vendons jamais vos renseignements. Les communications marketing exigent un consentement séparé, que vous pouvez retirer en tout temps.', 'Only to find your space, arrange tours, negotiate and prepare the lease, and to communicate with you about it. We never sell your information. Marketing communications require separate consent, which you can withdraw at any time.')}</p>

          <h2>{x('Avec qui nous les partageons', 'Who we share it with')}</h2>
          <p>{x('Avec les propriétaires des locaux qui vous intéressent, seulement ce qui est nécessaire et avec votre accord. Avec nos fournisseurs (hébergement, courriel, signature électronique), liés par contrat à la confidentialité.', 'With the landlords of spaces you are interested in, only what is necessary and with your agreement. With our providers (hosting, email, e-signature), bound by contract to confidentiality.')}</p>

          <h2>{x('Où et combien de temps', 'Where and for how long')}</h2>
          <p>{x('Vos renseignements sont hébergés au Canada. Les documents sont chiffrés et accessibles seulement à vous et à votre agent. Nous les conservons pendant la durée de votre dossier, puis le temps exigé par les règles de l’OACIQ et la loi, après quoi ils sont détruits ou anonymisés. Une demande sans suite est supprimée après 24 mois d’inactivité.', 'Your information is hosted in Canada. Documents are encrypted and accessible only to you and your agent. We keep them for the life of your file, then for the period required by OACIQ rules and the law, after which they are destroyed or anonymized. An inactive request is deleted after 24 months.')}</p>

          <h2>{x('Vos droits', 'Your rights')}</h2>
          <p>{x('Vous pouvez demander à consulter, corriger ou supprimer vos renseignements, retirer votre consentement ou obtenir vos données dans un format technologique structuré. Écrivez à la personne responsable : nous répondons dans les 30 jours. Vous pouvez aussi porter plainte à la Commission d’accès à l’information du Québec.', 'You can ask to see, correct or delete your information, withdraw consent, or get your data in a structured technological format. Write to the person in charge: we reply within 30 days. You may also file a complaint with the Commission d’accès à l’information du Québec.')}</p>

          <h2>{x('Témoins (cookies)', 'Cookies')}</h2>
          <p>{x('Le site utilise seulement les témoins nécessaires à son fonctionnement (session, sauvegarde du formulaire). Aucun témoin publicitaire n’est utilisé sans votre consentement.', 'The site uses only cookies needed for it to work (session, form saving). No advertising cookies are used without your consent.')}</p>

          <h2>{x('Incidents', 'Incidents')}</h2>
          <p>{x('En cas d’incident de confidentialité présentant un risque de préjudice sérieux, nous vous avisons, ainsi que la Commission d’accès à l’information, sans délai.', 'If a privacy incident poses a risk of serious harm, we notify you and the Commission d’accès à l’information without delay.')}</p>

          <p className="note-reserve">{x('Dernière mise à jour : novembre 2026.', 'Last updated: November 2026.')}</p>
        </div>
      </section>
    </>
  );
}
