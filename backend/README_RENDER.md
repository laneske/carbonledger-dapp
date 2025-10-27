# Deploying the backend to Render

This project includes a `render.yaml` manifest at the repository root to streamline creating or updating a Render Web Service for the backend.

Quick steps to deploy on Render (recommended):

1. Go to https://dashboard.render.com and click "New" -> "Web Service" -> "Connect a repository" and choose this repository.
2. When Render asks for a path, set it to `backend` (the manifest already includes this), or allow Render to detect the `render.yaml` manifest.
3. Set up the following Environment Variables in the Render service settings (DO NOT commit secrets to Git):

   - `OPERATOR_ID` — your Hedera account id (e.g. `0.0.6651338`)
   - `OPERATOR_PRIVATE_KEY` — your Hedera private key (rotate if previously leaked)
   - `CONTRACT_ADDRESS` — deployed contract address (e.g. `0x1C18dc9a987...`)
   - `HEDERA_NETWORK` — `testnet` (already defaulted in manifest)
   - `MIRROR_NODE_URL` — `https://testnet.mirrornode.hedera.com` (already defaulted)

4. Build & Start commands (the manifest sets these):

   - Build command: `npm install`
   - Start command: `npm start`

5. Ensure the Environment / Node version is 18.x or higher.

6. Trigger a manual deploy (Deploys -> Manual Deploy) or push to `main` to trigger auto-deploy (manifest sets `autoDeploy: true`).

Troubleshooting
---------------

- If the service returns 404:
  - Check the Render logs (Dashboard -> Service -> Logs) for startup errors or crashes.
  - Ensure `npm install` succeeds and `node server.js` actually runs (Render should show `Server running on port ...`).
  - Confirm required environment variables are set in the Render dashboard.

- If the service crashes on start with an `EADDRINUSE` or `EACCES`, ensure no hard-coded port conflicts and rely on `process.env.PORT` — the server already uses `process.env.PORT`.

How I can help
---------------

- I can deploy the frontend to Netlify and update the README with the Netlify URL.
- If you provide a Render API key (or paste the latest Render logs), I can inspect logs and pinpoint the exact startup error and suggest a targeted fix.

Security note
-------------

Never commit `OPERATOR_PRIVATE_KEY` or other secrets to the repository. Use Render's dashboard to set these securely.
