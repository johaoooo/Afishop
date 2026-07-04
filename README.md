# AFI Collection — Frontend

Site e-commerce simple, en React + Vite + TypeScript + Tailwind v4.

## Démarrer en local

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:5173

## Connexion au backend

L'URL de l'API est définie dans `.env` :
```
VITE_API_URL=http://localhost:5000/api
```
Change cette valeur pour pointer vers ton backend Node/Express en local ou en production.

## Structure

```
src/
├── lib/api.ts            → TOUS les appels API sont ici, dans ce seul fichier
├── context/
│   ├── AuthContext.tsx    → connexion / inscription / déconnexion
│   └── CartContext.tsx    → panier (persisté dans le navigateur)
├── components/
│   ├── Header.tsx, Footer.tsx, Layout.tsx
│   └── ProductCard.tsx
└── pages/
    ├── Home.tsx           → /
    ├── Shop.tsx           → /boutique
    ├── ProductDetail.tsx  → /produit/:id
    ├── Cart.tsx           → /panier
    ├── Checkout.tsx       → /validation-commande
    ├── Login.tsx          → /connexion
    ├── Register.tsx       → /inscription
    ├── Account.tsx        → /mon-compte (historique des commandes)
    ├── Contact.tsx        → /contact
    └── About.tsx          → /a-propos
```

Aucune bibliothèque de state management (pas de Zustand, pas de Redux) : juste
deux Context React (`AuthContext`, `CartContext`), simples à suivre de bout
en bout.

## Étape suivante : le paiement Kkiapay

La page de paiement (widget Kkiapay + appel à `/api/payments/verify`) n'est
pas encore branchée. Pour l'ajouter :
1. `npm install @kkiapay-org/react`
2. Créer `src/pages/Payment.tsx`, route `/paiement/:orderId`
3. Après succès du widget, appeler `paymentsApi.verify(transactionId, orderId)`
   (déjà présent dans `src/lib/api.ts`)
