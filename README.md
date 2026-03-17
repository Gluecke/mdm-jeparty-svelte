# Jeparty (SvelteKit)

A real-time Jeopardy answer-submission app built with SvelteKit, Tailwind CSS, and Firebase Firestore. Contestants submit answers, a timer counts down, and the host reveals/resets answers — all synchronized in real time across clients.

The original Angular version can be found at [Gluecke/mdm-jeparty](https://github.com/Gluecke/mdm-jeparty).

## Prerequisites

- Node.js 18+
- Java 11+ (required by the Firestore emulator)
- Firebase CLI: `npm install -g firebase-tools`

## First-time setup

**1. Install dependencies**
```sh
npm install
```

**2. Set up environment variables**
```sh
cp .env.example .env
```

Edit `.env` and set your Firebase project ID. For local emulator use, only the project ID needs to be real:
```env
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=placeholder
VITE_FIREBASE_AUTH_DOMAIN=placeholder
VITE_FIREBASE_STORAGE_BUCKET=placeholder
VITE_FIREBASE_MESSAGING_SENDER_ID=placeholder
VITE_FIREBASE_APP_ID=placeholder
VITE_USE_EMULATOR=true
```

**3. Log in to Firebase and select your project**
```sh
firebase login
firebase use --add
```
When prompted for an alias, use something like `svelte`.

## Local development

Start the Firebase emulators and the dev server in **separate terminals**:

**Terminal 1 — Firebase emulators**
```sh
firebase emulators:start
```

Emulator UI is available at `http://localhost:4000`.
Firestore runs on port `8080`, Auth on `9099`, Hosting on `5000`.

To persist emulator data between restarts:
```sh
firebase emulators:start --export-on-exit=./emulator-data --import=./emulator-data
```

**Terminal 2 — SvelteKit dev server**
```sh
npm run dev
```

App is available at `http://localhost:5173`.

## Building for production

```sh
npm run build
```

Output goes to `build/`. Preview the production build locally:
```sh
npm run preview
```

## Deploying

### Automatic deployment via GitHub Actions

Deployments are handled automatically by the GitHub Actions workflow at `.github/workflows/main.yml`. To trigger a deployment:

1. Go to the repository on GitHub
2. Click **Releases** → **Draft a new release**
3. Create a new tag (e.g. `v1.0.1`), add a title, and click **Publish release**

The workflow will:
- Install dependencies
- Build the app with Firebase config injected from GitHub Secrets
- Deploy hosting and Firestore rules to Firebase

You can monitor the deployment progress under the **Actions** tab on GitHub.

### Required GitHub Secrets

The following secrets must be set in the repository (Settings → Secrets and variables → Actions):

| Secret | Description |
|--------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key (for App Check) |
| `FIREBASE_TOKEN` | Firebase CI token from `firebase login:ci` |

### Manual deployment

```sh
firebase deploy --only hosting,firestore:rules
```

Make sure `.env` has real Firebase config values (not placeholders) before deploying manually.

## Firebase project management

```sh
firebase use svelte      # switch to SvelteKit project
firebase projects:list   # list all projects
```
