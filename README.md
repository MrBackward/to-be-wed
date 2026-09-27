# Nat & Xander RSVP

Personalised wedding RSVPs. Each invitation carries a QR code with a signed link. Scanning it opens a page that greets the guests by name and lets them RSVP. Anyone without a valid link only sees a "please scan your invitation" page. Responses are written straight into the guest list Google Sheet.

Next.js 16, TanStack Form, Zod, Google Sheets API, deployed to AWS (Lambda + CloudFront) with SST.

## How it works

- A link looks like `https://natandxander.wedding/i/<id>.<signature>`. The signature is an HMAC of the id using `LinkSecret`, so links can't be guessed or forged.
- The token lives in the sheet's **HASH STRING** column. Couples linked through **Connected for single invite** share one token and one QR code, and answer per person.
- Each person taps **Accepts** or **Declines**. Below that is an optional "make it fun" section: a feeling (free text or a suggestion), an emoji, and a synonym for their reply ("Ecstatically RSVPs yes 🥳").
- **plus one allowed** = `Yes` offers that guest a +1 (with a name) once they accept.
- RSVPs can only be sent once. After that the link shows a confirmation.
- The site only ever writes these cells: **Invite Accepted** (`Yes`/`No`), **With +1** (the +1's name), **Song Requests**, **Message to couple**, and **RSVP Response** (the full phrase, if you add that column; it's optional). Everything else, including the totals formulas, is left alone. Columns are found by header name, so they can be moved around.

## One-time setup

### Google

1. In [Google Cloud Console](https://console.cloud.google.com/) create a project and enable the **Google Sheets API**.
2. Create a **service account**, then add a **JSON key** and download it.
3. Share the guest sheet with the service account's email as **Editor**.

### AWS

1. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and sign in with `aws configure` (or `aws configure sso`) using an admin user in the account that owns the domain.
2. The `production` stage serves `natandxander.wedding` (plus a `www` redirect). SST creates the DNS records and certificate, which needs the domain's hosted zone in Route 53.

### Secrets

Set these once per stage. Without `--stage` they go to your personal dev stage; add `--stage production` for the live site.

```bash
npx sst secret set LinkSecret "$(openssl rand -base64 32)"
npx sst secret set GoogleClientEmail "your-service-account@your-project.iam.gserviceaccount.com"
npx sst secret set GooglePrivateKey "$(node -p "require('./key.json').private_key")"
npx sst secret set SheetId "the-id-from-the-sheet-url"
```

`SiteUrl` defaults to `http://localhost:3000` in dev and `https://natandxander.wedding` in production. Set `SHEET_TAB` in your environment if the guests aren't on the first tab.

> **Never change the production `LinkSecret` once invitations are printed.** Every QR code would stop working.

## Development

```bash
npm install
npx sst dev
```

This runs `next dev` with the secrets linked. Open `http://localhost:3000/i/<token>` using a token from the sheet.

## Generating invites

```bash
npm run invites -- --dry-run
npm run invites
```

- Gives every invitation without a token a new one and writes it to HASH STRING. Existing tokens are never changed, so it's safe to re-run after adding guests.
- Writes a QR code per invitation to `qr/` (SVG for print, 1200px PNG) plus `qr/invites.csv` with names and links.
- Warns about duplicate names, one-way or missing partners, and tokens not signed by this stage's `LinkSecret`.
- `--rotate "Guest Name"` issues a new link for that invitation, revoking the old one.
- `npm run invites:prod` does the same against the production stage and sheet.

## Deploying

```bash
npx sst deploy --stage production
```

## Going live checklist

1. Build the final guest sheet, share it with the service account, and set the production secrets.
2. Fill in the wedding details in `src/config/wedding.ts`.
3. Deploy, then run `npm run invites:prod -- --dry-run` and check the warnings.
4. Run `npm run invites:prod` and send the `qr/` files to print.
5. Scan a printed code with a phone, RSVP, then clear that test response from the sheet.
