# Branded authentication email setup

The application uses Supabase Auth for account verification, email-code sign-in, and password recovery. The welcome message and guardian-consent messages are sent by the Idilewa Resend integration; Supabase Auth verification messages use the SMTP provider configured in the Supabase project.

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
3. In **Authentication → Email Templates**, use the matching HTML from `supabase/templates/` for **Confirm signup**, **Magic link**, **Reset password**, and **Change email address**. Keep the `{{ .Token }}` and `{{ .ConfirmationURL }}` variables intact.
4. Keep email confirmation enabled. The application expects users to verify before their account can sign in.
5. Send a test sign-up, email-code sign-in, and password-reset message to confirm sender authentication, branding, and the configured redirect URL.

The SMTP and template settings live in the Supabase Auth project configuration; Vercel environment variables alone do not change them. Ordinary password sign-in does not send an email notification. Verification, sign-in-code, recovery, and security emails remain branded and use the configured SMTP delivery service.
