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

**Custom domain (`redirect_uri_mismatch`):** If users sign in at `https://modularequity.com` but Google still fails, NextAuth may be using the wrong base URL. Set **one** of these in Vercel (Production) to your **exact** public origin (no trailing slash):

- `AUTH_URL` = `https://modularequity.com`  
- or `APP_URL` = `https://modularequity.com`  
- or `NEXT_PUBLIC_APP_URL` = `https://modularequity.com`

If **none** of these are set, the app derives a URL from `APP_URL`, `NEXT_PUBLIC_APP_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`. **When multiple are present, it prefers a host that is not `*.vercel.app`** so the OAuth `redirect_uri` matches your custom domain in Google Cloud (as long as you added that redirect URI). Redeploy after changing env vars.

Then add **both** redirect URIs in Google Console if you use custom domain **and** `*.vercel.app`:

- `https://modularequity.com/api/auth/callback/google`
- `https://<project>.vercel.app/api/auth/callback/google`

## Recommended fix order (redirect_uri_mismatch)

1. **Copy the exact URI from the error** — Google’s error details show `redirect_uri=...`; that string must appear **character-for-character** in Google Cloud → Credentials → OAuth client → **Authorized redirect URIs**.
2. **Add both hosts if you use custom domain + Vercel URL**, e.g.  
   `https://modularequity.com/api/auth/callback/google` **and**  
   `https://<project>.vercel.app/api/auth/callback/google`.
3. **Set Vercel Production env** to your public site (no trailing slash): `AUTH_URL=https://modularequity.com` (or `NEXT_PUBLIC_APP_URL` / `APP_URL`). **Redeploy** after changing.
4. **JavaScript origins** must list the same hosts without paths: `https://modularequity.com`, etc.
5. Wait **a few minutes** after saving in Google Cloud.

See also: `/help/google-signin` on the site.

## Troubleshooting

- **redirect_uri_mismatch** — The URI in the browser’s error must **exactly** match one entry in Google (including `https`, no trailing slash on the callback path unless you added one).
- **Preview URLs** — Each unique `*.vercel.app` host needs its own redirect URI unless you only test Google login on production.

### GoDaddy “lander” page after choosing a Google account

If the browser ends up on a **GoDaddy** URL like `https://modularequity.com/lander?...` (with `code=`, `scope=`, etc. in the query string), **our app did not send you there** — there is no `/lander` route in the codebase. Google redirects to **exactly** the **Authorized redirect URI** you configured. That usually means one of:

1. **Wrong redirect URI in Google Cloud** — Someone added `https://modularequity.com/lander` (or similar) instead of the NextAuth callback. **Fix:** In [Credentials → your OAuth client → Authorized redirect URIs](https://console.cloud.google.com/apis/credentials), **remove** any `/lander` entry and ensure you have only:
   - `https://modularequity.com/api/auth/callback/google`
   - plus your `*.vercel.app` callback if you use it.
2. **Domain still on GoDaddy parking / not pointing at Vercel** — If `modularequity.com` DNS still points to GoDaddy’s parking or a “Website Builder” placeholder, **any** path (including `/api/auth/callback/google`) can show a generic GoDaddy page and sign-in will fail. **Fix:** In your domain registrar / DNS, point the apex (and `www` if used) to **Vercel** per [Vercel’s custom domain docs](https://vercel.com/docs/concepts/projects/domains) (A/ALIAS/CNAME as required). Until DNS serves your Vercel deployment, OAuth cannot complete on that hostname.

After fixing (1) and/or (2), wait a few minutes for DNS/Google changes, then try again.
