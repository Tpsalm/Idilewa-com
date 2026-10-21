# Branded authentication email setup

The application uses Supabase Auth to generate signup, sign-in, and recovery codes. The Vercel `/api/auth/email-code` endpoint sends those codes through the Resend API so delivery errors are surfaced by the application and email delivery does not depend on Supabase SMTP. Welcome and guardian-consent messages also use the Idilewa Resend integration. The four branded Supabase Auth templates remain declared in `supabase/config.toml` for other Auth-generated messages.

## Database deployment order

Apply the repository's pending Supabase migrations before deploying the application. In particular, child sign-in checks `child_guardian_is_approved()`, and parent/educator dashboards require the educator-consent tables and RPCs. Deploying the application before those migrations are applied can prevent child sign-in and make the dashboards unavailable.

Link the Supabase CLI to the Idilewa project, inspect the pending migrations, then apply them with `supabase db push`. Do not link or push against a different project.

To have authentication messages arrive from Idilewa rather than the default Supabase sender:

1. Verify the Idilewa sending domain in Resend and ensure the configured `RESEND_FROM_EMAIL` address is authorized.
2. In the Supabase project, open **Authentication → SMTP Settings**, enable custom SMTP, and configure Resend:
   - Host: `smtp.resend.com`
   - Port: `465` (or the port recommended by Resend)
   - Username: `resend`
   - Password: the Resend API key, entered directly in Supabase and never committed to this repository
   - Sender name: `Idilewa`
   - Sender email: the verified Idilewa address used by `RESEND_FROM_EMAIL`
3. Deploy `public/assets/idilewa-email-logo.png` to `https://www.idilewa.com/assets/idilewa-email-logo.png` before enabling the confirmation template. Preview the auth-template changes with `supabase config diff --project-ref <project-ref>`. The confirmation email deliberately uses a one-time code, not a confirmation link. After the code is verified, the Idilewa sign-up screen returns the user to sign-in so they can enter their email and password. The other templates retain Supabase's confirmation URL where appropriate.
4. Apply the reviewed template settings with `supabase config push --project-ref <project-ref>`. This project config declares only the four email templates; it does not configure or replace SMTP credentials.
5. Keep email confirmation enabled. The application expects users to verify before their account can sign in.
6. Send a test sign-up, email-code sign-in, and password-reset message to confirm sender authentication, branding, and delivery.

The SMTP and template settings live in the Supabase Auth project configuration; Vercel environment variables alone do not change them. Ordinary password sign-in does not send an email notification; users may explicitly request a sign-in code on the sign-in form. Signup verification, sign-in-code, and recovery codes use the configured Resend API sender and are subject to Supabase Auth code expiration and the `auth_email_code` rate limits.
