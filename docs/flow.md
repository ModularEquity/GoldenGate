# User flow (Mermaid)

Use this in GitHub/GitLab previews or any Mermaid renderer. Aligns with `AGENTS.md`.

```mermaid
flowchart TD
  A[Home] --> B[Register Email]
  B --> B1[Email: magic link]
  B1 --> B2[Set password]
  B2 --> B3[Dashboard]
  B3 --> C[Register Investor Account - DocSign]
  C --> D[Questionnaire - DocSign]
  D --> E[PPM - Read-only]
  E --> F[Risk Disclosures - DocSign]
  F --> G[Tax W-9 / W-8 - DocSign]
  G --> H[Wire / ACH Instructions - DocSign]
  H --> I[Operating Doc - Read-only]
  I --> J[Cap Table - Read-only]
  J --> K[Review Deal - Read-only]
  K --> L[Subscribe to Deal - DocSign]
  L --> M[Fund Deal - Plaid/Stripe ACH]
```

## Wireframe checklist (for Figma/Lucid)

- Home: hero, thesis (fix-and-flip), trust signals, primary CTA → register.
- Register: email field, consent checkbox, submit.
- Post-login shells: document viewer, deal cards, subscription summary (stub until backend exists).
