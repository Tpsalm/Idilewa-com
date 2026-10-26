# Branded authentication email setup

The application uses Supabase Auth for account creation, sign-in, and one-time verification. The Vercel `/api/auth/email-code` endpoint sends child sign-in codes and password-recovery links through Resend. Recovery links are generated server-side with Supabase Admin and sent through Resend, avoiding Supabase's `/auth/v1/recover` email-delivery path. The service-role key remains server-side. Welcome and guardian-consent messages also use the Idilewa Resend integration. The four branded Supabase Auth templates remain declared in `supabase/config.toml` for other Auth-generated messages.

## Database deployment order

Apply the repository's pending Supabase migrations before deploying the application. In particular, child sign-in checks `child_guardian_is_approved()`, and parent/educator dashboards require the educator-consent tables and RPCs. Deploying the application before those migrations are applied can prevent child sign-in and make the dashboards unavailable.

Link the Supabase CLI to the Idilewa project, inspect the pending migrations, then apply them with `supabase db push`. Do not link or push against a different project.

To have authentication messages arrive from Idilewa rather than the default Supabase sender:

1. Verify the Idilewa sending domain in Resend and ensure the configured `RESEND_FROM_EMAIL` address is authorized. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GUARDIAN_TOKEN_SECRET`, and `APP_BASE_URL=https://www.idilewa.com` as server-side Vercel environment variables. Never use a `VITE_` prefix for secrets.
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
6. Send a test sign-up, email-code sign-in, and password-reset message to confirm sender authentication, branding, callback routing, and delivery.

The SMTP and template settings live in the Supabase Auth project configuration; Vercel environment variables alone do not change them. Password recovery uses the server-side Resend integration and the Supabase-generated recovery link; it is subject to the `auth_email_code` request limits. Ordinary password sign-in does not send an email notification; children may request a parent-issued sign-in code on the sign-in form.
