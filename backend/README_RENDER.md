# Deploying the backend to Render

This project includes a `render.yaml` manifest at the repository root to streamline creating or updating a Render Web Service for the backend.

Quick steps to deploy on Render (recommended):

1. Go to https://dashboard.render.com and click "New" -> "Web Service" -> "Connect a repository" and choose this repository.
2. When Render asks for a path, set it to `backend` (the manifest already includes this), or allow Render to detect the `render.yaml` manifest.
3. **⚠️ CRITICAL: Set the following Environment Variables in the Render service settings.** The service will **NOT** respond (404) without these:

   - `OPERATOR_ID` — your Hedera account id (e.g. `0.0.6651338`) **REQUIRED**
   - `OPERATOR_PRIVATE_KEY` — your Hedera private key (rotate if previously leaked) **REQUIRED**
   - `CONTRACT_ADDRESS` — deployed contract address (e.g. `0x1C18dc9a987...`) **REQUIRED**
   - `HEDERA_NETWORK` — `testnet` (already defaulted in manifest)
   - `MIRROR_NODE_URL` — `https://testnet.mirrornode.hedera.com` (already defaulted)

   See `.env.example` in the `backend/` folder for the template. Do NOT commit these secrets to Git — use Render's dashboard to set them securely.

4. Build & Start commands (the manifest sets these):

   - Build command: `npm install`
   - Start command: `npm start`

5. Ensure the Environment / Node version is 18.x or higher.

6. Trigger a manual deploy (Deploys -> Manual Deploy) or push to `main` to trigger auto-deploy (manifest sets `autoDeploy: true`).

Troubleshooting
---------------

### If the service returns 404 or "Not Found":

**Root cause:** Missing or incorrect environment variables in Render dashboard.

**Fix:**
1. Open https://dashboard.render.com
2. Select your `carbonledger-backend` service
3. Go to **Environment** tab
4. Verify these are set (copy from your local `.env`):
   - `OPERATOR_ID` (e.g., `0.0.6651338`)
   - `OPERATOR_PRIVATE_KEY` (e.g., `0x26408e6f...`)
   - `CONTRACT_ADDRESS` (e.g., `0x1C18dc9a...`)
5. If any are missing, click "Add Environment Variable" and enter them
6. **Click "Save"** (changes don't apply until saved)
7. Go to **Deploys** and click **Manual Deploy** to rebuild with the env vars
8. Watch **Logs** — you should see:
   - `npm install ...` (build succeeds)
   - `🌱 CarbonLedger Backend Server running on port ...` (server started)
   - No error stack traces

### If the build fails or logs show an error:
- Paste the last 50 lines of the Render Logs here and I will diagnose the exact issue.

### If the service crashes after startup (no 404, just timeout):
- Check if `OPERATOR_PRIVATE_KEY` is correct (no typos, no extra quotes).
- Check if `CONTRACT_ADDRESS` is a valid hex address.
- Check if `OPERATOR_ID` matches your Hedera testnet account.
- If credentials are wrong, the Hedera SDK calls will fail — update env vars, save, and redeploy.

### If the service starts but `/api/health` returns an error instead of JSON:
- The backend is running, but the Hedera connection is failing.
- Check your OPERATOR_PRIVATE_KEY and OPERATOR_ID are correct (can query Hedera with curl if needed).
- Check CONTRACT_ADDRESS is deployed on the testnet (verify on https://hashscan.io/testnet/contract/...).

How I can help
---------------

- I can deploy the frontend to Netlify and update the README with the Netlify URL.
- If you provide a Render API key (or paste the latest Render logs), I can inspect logs and pinpoint the exact startup error and suggest a targeted fix.

Security note
-------------

Never commit `OPERATOR_PRIVATE_KEY` or other secrets to the repository. Use Render's dashboard to set these securely.
