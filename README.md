# Sanayya — connected beginner build

This package connects the Sanayya website to your existing Supabase project.

## You already completed
- Supabase project created
- Sanayya database tables created
- `sanayya.om` Admin user created
- Admin role set to `admin`

## What you must do

### 1. Put your Supabase Publishable Key in `config.js`
Open `config.js` and replace:
`PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE`
with the **Publishable key** from Supabase > Project Settings > API.

Do NOT use a Secret or service_role key.

### 2. Run the database upgrade
In Supabase SQL Editor, paste the entire contents of:
`supabase/upgrade.sql`
then click Run.

### 3. Deploy the website
Upload all website files to Vercel. This is a static HTML site; no build command is needed.

### 4. Deploy the Admin user function
In Supabase > Edge Functions, create a function named:
`admin-create-user`
and paste the code from:
`supabase/functions/admin-create-user/index.ts`

It needs the normal Supabase function secrets, especially `SUPABASE_SERVICE_ROLE_KEY` (Supabase normally provides its service secrets to Edge Functions). NEVER put that secret in browser files.

### 5. AI
The included `analyze-damage` function is the server-side structure for Gemini vision. Add `GEMINI_API_KEY` as a Supabase Edge Function secret. Do not put Gemini API keys in HTML/JS.

## Important
The homepage now saves a submitted check into Supabase. The live Gemini analysis requires the Edge Function to be deployed and configured.

The first connected login uses **email + password** because Supabase Auth natively supports that. Your profile still has a username field, and a username-first login can be added later.

## Pages
- index.html — AI Damage Check
- services.html — physical inspection / parts / garages
- login.html — unified login
- customer.html — customer dashboard
- inspector.html — inspector dashboard
- garage.html — garage dashboard
- parts.html — parts supplier dashboard
- admin.html — admin dashboard

## Security
- Browser uses only the Publishable key.
- Secret/service_role keys stay server-side.
- RLS policies are included in `upgrade.sql`.
- Admin creates business users through the Edge Function, not from browser-side admin APIs.

## BidCars public listing lookup
The homepage now accepts either a 17-character VIN or a complete public vehicle URL beginning with `https://bid.cars/en/`.
For a complete BidCars URL, the `fetch-bidcars` Edge Function reads the public listing page without requiring the visitor to log into BidCars and displays only information stated on that public page, including start code (Run and Drive when stated), drive type/driveline, primary/secondary damage, loss, seller, sale document, odometer, key status and other listed vehicle fields. Flood/water/fire is reported only when those terms are actually stated in the public page data; absence of a statement is not treated as a clean result.

Deploy the new function with:
`supabase functions deploy fetch-bidcars`


## Inspection price
The public Services page reads `inspection_price_omr` from `site_settings`. The default is 5 OMR. Admin can change it later from the Admin dashboard (for example to 10 or 12 OMR).


## v4 legal pages
- `terms.html` and `privacy.html` load editable text from Supabase.
- `login.html` requires agreement to both documents before sign-in and records the accepted version.
- Admin can edit both documents from the Legal documents section. Saving increments the document version.
- Run the updated `supabase/upgrade.sql` once before using these features.
- Review the seeded legal templates with an Oman-qualified lawyer before relying on them.
