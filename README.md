## Psychologists Services

Psychologists Services is a modern React + TypeScript application for discovering, filtering, and booking psychologists, with authentication, favorites, and appointment requests backed by Firebase.

### Features

- **Home (Landing)**
  - Hero section with headline, supporting copy, and primary CTA **“Get started”** that navigates to the `Psychologists` page.
  - Responsive layout and animated decorative badges.

- **Psychologists**
  - Data loaded from **Firebase Realtime Database**, with a safe fallback to local seed data in case of network issues.
  - Sorting / filtering options:
    - Name: **A to Z**, **Z to A**
    - Price: **Less than 10$**, **Greater than 10$**
    - Rating: **Not popular**, **Popular**
  - Incremental loading: initially 3 cards, with “Load more” to append more results.
  - Expanded view via **“Read more”** to show detailed profile info and reviews.
  - **“Make an appointment”** opens a modal with a validated appointment form.

- **Favorites (Protected area)**
  - Accessible only to authenticated users.
  - Displays all psychologists added to favorites.
  - Uses the same card layout and filtering UX as the main `Psychologists` page.

### Authentication & Firebase

- **Firebase Authentication**:
  - Email/password login & registration.
  - Google Sign-In via `GoogleAuthProvider` and `signInWithPopup`.
- Auth state is tracked via `onAuthStateChanged` and exposed through a React context.
- Favorites are stored per user in **Firebase Realtime Database** under `users/{uid}/favorites` and restored on page reload.

### Forms & Validation

- Auth forms (`AuthForms`) and appointment form (`AppointmentForm`) use:
  - `react-hook-form` for form state and submission.
  - `yup` (via `@hookform/resolvers/yup`) for schema validation.
- All fields are required, with user-friendly error messages.
- Modals can be closed by:
  - close button,
  - clicking on the backdrop,
  - pressing `Esc`.

### Technology Stack

- **Frontend**
  - React 19 + TypeScript
  - Vite (dev server and production build)
  - React Router (`HashRouter` with routes `/`, `/psychologists`, `/favorites`)
  - Tailwind CSS via CDN configuration in `index.html`

- **Backend / Services**
  - Firebase:
    - `firebase/app`
    - `firebase/auth`
    - `firebase/database`
  - Realtime Database structure:
    - `psychologists` – primary dataset for the listing
    - `users/{uid}/favorites` – user-specific list of favorite psychologist IDs

### Responsiveness

- Layout is optimized from **320px** up to large desktop widths:
  - Hero title scales per breakpoint (`text-4xl` → `text-5xl` → `text-7xl`).
  - Hero image height adapts for mobile / tablet / desktop to avoid vertical overflow.
  - CTA button is full-width on small screens and auto-sized on larger ones.
- The “Experienced psychologists / 15,000” block:
  - Renders as an overlay badge on desktop screens.
  - Renders as a compact horizontal card below the hero image on mobile (`md:hidden`), so it never overflows the viewport.

### Project Structure (high level)

- `App.tsx` – application root, routing, page components, and context provider.
- `components/` – reusable UI pieces:
  - `PsychologistCard`, `AppointmentForm`, `AuthForms`, `Button`, `Modal`, `Toast`, `SkeletonCard`, etc.
- `firebase.ts` – Firebase initialization, `auth`/`db` instances, and `signInWithGoogle` helper.
- `data.ts` – local fallback dataset for psychologists.
- `types.ts` – shared TypeScript interfaces and enums (`Psychologist`, `Review`, `FilterType`, etc.).
- `public/`
  - `images/hero/` – hero images (`psychologist.jpg`, `psychologist@2x.jpg`).
  - `icons/sprite.svg` – SVG sprite for arrow and filter chevron icons.
  - `favicon.svg` – site favicon.

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Firebase**

   Create a `.env` file in the project root and add your Firebase configuration:

   ```bash
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_DATABASE_URL=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   Open the printed local URL (typically `http://localhost:5173/`) in your browser.

### Build & Deployment

1. **Create a production build**

   ```bash
   npm run build
   ```

   The optimized output will be generated in the `dist/` folder.

2. **Preview the production build locally (optional)**

   ```bash
   npm run preview
   ```

3. **Deploy**

   Deploy the contents of `dist/` to any static hosting provider, such as:

   - Vercel
   - Netlify
   - GitHub Pages
   - Firebase Hosting

   Since the app uses `HashRouter`, it is safe for static hosts without custom rewrite rules.

### Notes

- Do **not** commit your `.env` file; keep Firebase credentials in a secure location or CI/CD secrets.
- The app targets modern evergreen browsers with JavaScript enabled.


