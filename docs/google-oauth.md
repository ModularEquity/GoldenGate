# Google OAuth — redirect URIs (NextAuth)

NextAuth uses this callback path for Google:

```
https://<your-host>/api/auth/callback/google
```

## What to add in Google Cloud Console

1. Open **[Google Cloud Console](https://console.cloud.google.com/)** → **APIs & Services** → **Credentials**.
2. Open your **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized redirect URIs**, click **Add URI** and add **every** URL where users sign in:

| Environment | Redirect URI |
|-------------|--------------|
| **Production** (custom domain) | `https://your-production-domain.com/api/auth/callback/google` |
| **Production** (Vercel default) | `https://<your-project>.vercel.app/api/auth/callback/google` |
| **Preview deploys** (optional) | Each preview URL needs its own URI, e.g. `https://golden-gate-xxxxx-team.vercel.app/api/auth/callback/google` — or use a single **production** URL only and test Google login there |
| **Local dev** | `http://localhost:3000/api/auth/callback/google` |

4. Under **Authorized JavaScript origins**, add the origins only (no path):

| | Origin |
|---|--------|
| Production | `https://your-production-domain.com` |
| Vercel | `https://<your-project>.vercel.app` |
| Local | `http://localhost:3000` |

5. **Save**. Changes can take a few minutes to apply.

## Env vars (Vercel)

- `AUTH_GOOGLE_ID` — Client ID  
- `AUTH_GOOGLE_SECRET` — Client secret  

Optional: `AUTH_URL` = `https://your-production-domain.com` if the app should use your custom domain for OAuth (instead of only `VERCEL_URL`).

## Troubleshooting

- **redirect_uri_mismatch** — The URI in the browser’s error must **exactly** match one entry in Google (including `https`, no trailing slash on the callback path unless you added one).
- **Preview URLs** — Each unique `*.vercel.app` host needs its own redirect URI unless you only test Google login on production.
