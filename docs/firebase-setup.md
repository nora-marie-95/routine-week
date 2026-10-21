# Firebase setup (Google sign-in + cloud save)

The app works without any of this — it then saves only in the browser. With it, a signed-in
user's routines and todos are saved to their Google account and follow them across devices.

## One-time setup in Firebase

1. Go to https://console.firebase.google.com → **Add project** (Google Analytics can stay off).
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**, pick a support
   email, save.
3. **Build → Firestore Database → Create database** → production mode, any nearby region.
4. In Firestore, open the **Rules** tab, paste the contents of `firestore.rules`, **Publish**.
5. **Project settings (gear) → General → Your apps → `</>` Web** → register an app (no hosting).
   Copy the four values (`apiKey`, `authDomain`, `projectId`, `appId`) from the config shown.
6. **Authentication → Settings → Authorized domains → Add domain**: add the Vercel domain(s),
   e.g. `routine-week.vercel.app` (and a preview domain if you want sign-in on previews).
   `localhost` is already allowed.

## Wire the values into the app

- Locally: copy `.env.example` to `.env.local` and fill in the four values, then restart
  `npm run web`.
- On Vercel: Project → Settings → Environment Variables → add the four
  `EXPO_PUBLIC_FIREBASE_*` variables (Production and Preview), then redeploy. They are baked in
  at build time, so changing them needs a new deployment.

## How syncing behaves

- Signing in on a device merges what is on the device with what is in the account (nothing is
  dropped; if the same item exists on both, the device's version wins). After that the latest
  save wins: edits are saved about a second after you stop, and changes from another device
  replace what is shown here while it's open.
- Data is stored as a single document `users/{uid}` (the whole state as JSON). Firestore caps a
  document at 1 MiB — thousands of todos — which is far beyond normal use for this app.
- Signing out keeps the data on the device. Signing back in merges again, so something deleted
  on another device in between can reappear.
- Web only for now: the Google popup sign-in doesn't exist on iOS/Android, so native builds
  stay local-only until sign-in is added for them.
