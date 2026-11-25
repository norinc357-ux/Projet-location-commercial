# Clé en main Commercial (nom provisoire)

Plateforme web d'une agence de location de locaux commerciaux à Montréal.
Le nom de l'agence est **provisoire** : il se change à un seul endroit, `lib/config.ts`.

## État : étape 2 sur 6 — formulaire intelligent « Décrire mon projet »

| Étape | Contenu | État |
| --- | --- | --- |
| 1 | Architecture, parcours, modèle de données | Validée |
| 2 | Formulaire intelligent | **Livrée ici** |
| 3 | Pages publiques | À venir |
| 4 | Espace client | À venir |
| 5 | Tableau de bord agence | À venir |
| 6 | Automatisations, courriels, textos | À venir |

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000/decrire-mon-projet  et  /en/describe-my-project
npm test           # 30 tests (validation, conversions, logique conditionnelle, critères, qualification, fiche, créneaux)
npm run typecheck
npm run demo:build # démo autonome sans serveur : demo/dist/index.html
```

Node 20 ou plus récent.

## Organisation

```
lib/config.ts                  Nom de l'agence (provisoire)
lib/formulaire/
  ecrans.ts                    Les 9 étapes, écran par écran : questions, conditions, validations (source unique)
  referentiels.ts              Types de locaux, secteurs, critères de priorité, éléments éliminatoires
  lexique.ts                   Définitions des termes (infobulles « ? », futur lexique du Guide du locataire)
  calculs.ts                   Validation partagée client/serveur, conversions de loyer, estimation de superficie, progression
  criteres.ts                  Réponses → critères de jumelage (table `critere` du modèle de données)
  creneaux.ts                  Créneaux de l'appel découverte (heure de Montréal, fériés du Québec)
  affichage.ts                 Mise en forme lisible (récapitulatif, futur PDF)
  persistance.ts               Sauvegarde : appareil (localStorage) + serveur (API)
  qualification.ts             Score de priorité 0–100 et signaux (budget, urgence, financement…)
  ficheRecherche.ts            Réponses → fiche de recherche de l'agent (obligatoire, souhaitable, filtres, questions)
lib/exemples.ts                Demande d'EXEMPLE fictive (démo, tests)
app/agence/fiches/             Vue agence : demandes triées par priorité + fiche de chaque demande
middleware.ts                  Protège /agence par mot de passe (AGENCE_MOT_DE_PASSE)
lib/serveur/                   Dépôt JSON de développement, courriels (console), limites d'envoi
app/api/demandes/[jeton]/      GET/PUT brouillon · POST reprise (lien par courriel) · POST soumettre
components/formulaire/         Interface (tuiles, infobulles, curseur double, carte, rendez-vous, récapitulatif, merci)
demo/                          Démo autonome (Vite, un seul fichier HTML)
tests/                         Tests Vitest
```

## Fiche de recherche (vue agence)

Chaque demande envoyée produit une fiche : `/agence/fiches` (liste triée par score) puis `/agence/fiches/CEM-AAAA-NNNN`.
Elle contient les critères obligatoires, souhaitables et à écarter, le budget situé par rapport au marché, des filtres prêts à saisir dans Centris, LoopNet ou l'inventaire (avec bouton « Copier la fiche »), et les questions à poser pendant l'appel découverte.

Accès : définir `AGENCE_MOT_DE_PASSE` (n'importe quel nom d'utilisateur). Sans cette variable, `/agence` est fermé. De vrais comptes agents arrivent à l'étape 5.

## Ce que fait le formulaire

- 9 étapes, une question principale par écran, barre de progression, temps restant estimé, bouton Retour (aussi le bouton Retour du téléphone).
- Logique conditionnelle : l'étape 5 ne montre que les questions des types de locaux choisis (restaurant, commerce, bureau, industriel, clinique, atelier).
- Tuiles avec icônes, infobulle « ? » sur chaque terme technique, option « Je ne sais pas / Aidez-moi à choisir » sur chaque question technique (signalée à l'agent).
- Validation en temps réel avec messages polis ; les mêmes règles sont revérifiées par le serveur à l'envoi.
- Sauvegarde automatique (appareil immédiatement, serveur après 1,5 s) ; « Finir plus tard » envoie un lien de reprise par courriel (construit côté serveur, 3 envois par heure au maximum).
- Jamais deux fois la même information : pré-remplissage depuis une fiche de local (`?type=restaurant&local=L-0187`), estimation de la superficie à partir du nombre d'employés, conversion automatique loyer mensuel ↔ $/pi²/an, récapitulatif modifiable qui ramène au récapitulatif.
- Prise de rendez-vous de l'appel découverte (20 min) dans le formulaire, consentement Loi 25 non coché par défaut, consentement marketing séparé.
- Bilingue FR/EN, français par défaut ; mobile d'abord, navigation au clavier, thème sombre.

## Limites connues (prévues aux étapes suivantes)

- Stockage : fichier JSON (`.data/`) en développement ; PostgreSQL à l'étape 4.
- Fichiers téléversés : seules les métadonnées sont gardées ; stockage chiffré au Canada à l'étape 4.
- Courriels : affichés dans la console ; envoi réel (SES/Postmark) et PDF de la demande à l'étape 6.
- Disponibilités de l'appel : exemple déterministe ; synchro Google / Microsoft 365 des agents à l'étape 6.
- Carte : tuiles OpenStreetMap ; passage à Mapbox possible à l'étape 3.
