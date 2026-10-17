import { createHmac, randomBytes, randomUUID } from 'node:crypto';

const secret = process.env.GUARDIAN_TOKEN_SECRET;
if (!secret || secret.length < 32) {
  console.error('Set GUARDIAN_TOKEN_SECRET to the same 32+ character secret used by the deployed API.');
  process.exitCode = 1;
} else {
  const code = randomBytes(18).toString('hex').toUpperCase();
  const codeHash = createHmac('sha256', secret).update(code).digest('hex');
  const id = randomUUID();
  console.log(`Educator invitation code (share once): ${code}`);
  console.log('\nRun this SQL in the intended Supabase project to create a 7-day invite:');
  console.log(`INSERT INTO public.educator_invites (id, code_hash, expires_at) VALUES ('${id}', '${codeHash}', NOW() + INTERVAL '7 days');`);
}
