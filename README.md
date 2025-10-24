# CarbonLedger 🌱♻️
A blockchain-based carbon footprint tracking and trading platform that brings transparency to environmental accountability.
## 🌟 Features
## 🛠 Tech Stack
# CarbonLedger 🌱♻️

A blockchain-based carbon footprint tracking and trading platform that brings transparency to environmental accountability.

## Live deployment

- Front-end (Netlify): TBD — the front-end will be deployed to Netlify; the public URL will be added here after publish.
- Backend (Render): https://carbonledger-backend.onrender.com

> Note: if you provided a Netlify auth token and asked for a deploy, the front-end will be published and this README updated with the exact Netlify URL.

## Quick smoke tests

From a terminal you can check the hosted backend (Render) endpoints:

- Health check (should return basic status and contract address):

	# Cross-platform (curl)
	curl -s https://carbonledger-backend.onrender.com/api/health | jq .

	# PowerShell
	Invoke-RestMethod -Uri 'https://carbonledger-backend.onrender.com/api/health' -Method Get | ConvertTo-Json -Depth 5

- Total supply (should return numeric totalSupply):

	curl -s https://carbonledger-backend.onrender.com/api/supply | jq .

	Invoke-RestMethod -Uri 'https://carbonledger-backend.onrender.com/api/supply' -Method Get | ConvertTo-Json -Depth 5

If you run the front-end locally (or after the Netlify deploy), verify the UI:

- Open the site and ensure:
	- the navbar loads and shows the CarbonLedger title
	- the Mint tab shows a simple form to mint an NFT
	- the Portfolio or Gallery displays minted NFTs (or shows an empty state)

## Local development

1. Backend

	 cd backend
	 npm install
	 copy .env.example to .env and set OPERATOR_ID and OPERATOR_PRIVATE_KEY and CONTRACT_ADDRESS
	 npm run dev

2. Frontend

	 cd frontend
	 npm install
	 npm run build
	 npm run export
	 # serve the static export (or use the included scripts/serve_out.js)

## Notes

- Secrets (operator private key) must never be committed. Use the provided example env files and set real keys in your deployment environment.
- If you shared the Netlify auth token in chat, consider revoking it and re-issuing a new token in Netlify for security.

---

If you'd like, I can now:

1. Deploy the front-end to Netlify using the token you shared and update this README with the site URL.
2. Re-run the smoke tests against the live front-end and backend and report results.

Tell me which of the above you want me to run next.
