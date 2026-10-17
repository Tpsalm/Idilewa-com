import { createClient } from '@supabase/supabase-js';

const clientEnv = import.meta.env || {};
const supabaseUrl = clientEnv.VITE_SUPABASE_URL || clientEnv.SUPABASE_PUBLIC_URL || '';
const supabaseAnonKey = clientEnv.VITE_SUPABASE_ANON_KEY || clientEnv.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  : null;

const LOCAL_STORAGE_KEY_USER = 'idilewa_auth_user';
const LOCAL_STORAGE_KEY_PROGRESS = 'idilewa_db_progress';
const LOCAL_STORAGE_KEY_CODE = 'idilewa_db_code';
const LOCAL_STORAGE_KEY_VOICE = 'idilewa_db_voice';

function getLocalItem(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    throw new Error(`Could not read saved browser data (${key}).`, { cause: error });
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new Error(`Could not save browser data (${key}).`, { cause: error });
  }
}

function requireSupabase() {
  if (!supabase) throw new Error('Account storage is not configured.');
  return supabase;
}

function isAuthenticatedUserId(userId) {
  return typeof userId === 'string' && userId.length > 0 && !userId.startsWith('usr_') && userId !== 'anonymous';
}

function requirePersistedResult(data, error, message) {
  if (error) throw new Error(message, { cause: error });
  if (!data) throw new Error(message);
  return data;
}

export function isSignupPasswordValid(password) {
  return typeof password === 'string'
    && password.length >= 12
    && password.length <= 128
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9\s]/.test(password);
}

function mapProgress(row) {
  return {
    id: row.id,
    userId: row.user_id,
    lessonType: row.lesson_type,
    lessonId: row.lesson_id,
    meta: row.meta || {},
    completedAt: row.completed_at,
  };
}

function mapCodeSubmission(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title || 'Koodu Yorùbá Titun',
    code: row.code,
    output: row.output || '',
    language: row.language || 'yorubascript',
    createdAt: row.created_at,
  };
}

function mapVoiceRecord(row) {
  return {
    id: row.id,
    userId: row.user_id,
    text: row.text,
    targetLang: row.target_lang,
    audioScore: row.audio_score,
    pitchHz: row.pitch_hz,
    lessonId: row.lesson_id || '',
    createdAt: row.created_at,
  };
}

function mapAuthUser(authUser, metadata = authUser.user_metadata || {}) {
  return {
    id: authUser.id,
    email: authUser.email,
    name: metadata.name || authUser.email?.split('@')[0] || '',
    role: metadata.role || 'adult',
    avatar: metadata.avatar_url || '',
    bio: metadata.bio || '',
    learning_goal: metadata.learning_goal || '',
    learning_language: metadata.learning_language || 'yoruba',
    learning_level: metadata.learning_level || 'beginner',
    interests: Array.isArray(metadata.interests) ? metadata.interests : [],
    points: Number.isFinite(metadata.points) ? metadata.points : 0,
    streak: Number.isFinite(metadata.streak) ? metadata.streak : 0,
    createdAt: authUser.created_at || new Date().toISOString(),
  };
}

async function loadAccountProfile(client, authUser) {
  const { data: profile, error } = await client
    .from('profiles')
    .select('name, role, avatar_url, points, streak')
    .eq('id', authUser.id)
    .maybeSingle();
  if (error) throw new Error('Your account profile could not be loaded.', { cause: error });
  if (!profile) throw new Error('Your account profile is missing. Contact support before continuing.');
  return mapAuthUser(authUser, {
    ...authUser.user_metadata,
    ...profile,
    avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url,
  });
}

export async function signUp({ email, password, name, role = 'child', guardianAccessRequestId, educatorInviteId }) {
  const client = requireSupabase();
  if (!isSignupPasswordValid(password)) {
    throw new Error('Use 12–128 characters with uppercase and lowercase letters, a number, and a symbol.');
  }
  if (role === 'child' && !/^[0-9a-f-]{36}$/i.test(guardianAccessRequestId || '')) {
    throw new Error('A verified guardian approval is required before creating a child account.');
  }
  if (role === 'educator' && !/^[0-9a-f-]{36}$/i.test(educatorInviteId || '')) {
    throw new Error('A verified one-time educator invitation code is required before creating a teacher account.');
  }
  const normalizedEmail = email.toLowerCase().trim();
  const userName = name || normalizedEmail.split('@')[0];
  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        name: userName,
        role,
        ...(role === 'child' ? { guardian_access_request_id: guardianAccessRequestId } : {}),
        ...(role === 'educator' ? { educator_invite_id: educatorInviteId } : {}),
      },
    },
  });
  if (error) throw new Error(error.message, { cause: error });
  if (!data?.user) throw new Error('The authentication service did not return an account.');

  const userRecord = data.session
    ? await loadAccountProfile(client, data.user)
    : mapAuthUser(data.user, { ...data.user.user_metadata, name: userName, role });
  if (data.session) setLocalItem(LOCAL_STORAGE_KEY_USER, userRecord);
  return { user: userRecord, session: data.session, error: null };
}

export async function verifySignupOtp({ email, token }) {
  const client = requireSupabase();
  const normalizedEmail = email.toLowerCase().trim();
  if (!/^\d{6,8}$/.test(token)) throw new Error('Enter the verification code from your email.');
  const { data, error } = await client.auth.verifyOtp({
    email: normalizedEmail,
    token,
    type: 'signup',
  });
  if (error) throw new Error(error.message, { cause: error });
  if (!data?.user || !data.session) throw new Error('Email verification did not return a signed-in account.');
  const userRecord = await loadAccountProfile(client, data.user);
  setLocalItem(LOCAL_STORAGE_KEY_USER, userRecord);
  return userRecord;
}

export async function requestSigninOtp(email) {
  const client = requireSupabase();
  const normalizedEmail = email.toLowerCase().trim();
  const { error } = await client.auth.signInWithOtp({
    email: normalizedEmail,
    options: { shouldCreateUser: false },
  });
  if (error) throw new Error(error.message, { cause: error });
}

export async function verifySigninOtp({ email, token, expectedRole }) {
  const client = requireSupabase();
  if (!['child', 'educator'].includes(expectedRole)) {
    throw new Error('Email-code sign-in is available only for child and educator accounts.');
  }
  const normalizedEmail = email.toLowerCase().trim();
  if (!/^\d{6,8}$/.test(token)) throw new Error('Enter the verification code from your email.');
  const { data, error } = await client.auth.verifyOtp({
    email: normalizedEmail,
    token,
    type: 'email',
  });
  if (error) throw new Error(error.message, { cause: error });
  if (!data?.user || !data.session) throw new Error('Email verification did not return a signed-in account.');

  let userRecord;
  try {
    userRecord = await loadAccountProfile(client, data.user);
    if (userRecord.role !== expectedRole) {
      throw new Error(`This email belongs to a ${userRecord.role} account. Select the matching account type.`);
    }
  } catch (profileError) {
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) throw new Error('Could not clear the session after the account check failed.', { cause: signOutError });
    throw profileError;
  }

  setLocalItem(LOCAL_STORAGE_KEY_USER, userRecord);
  return userRecord;
}

export async function resendSignupOtp(email) {
  const client = requireSupabase();
  const { error } = await client.auth.resend({
    type: 'signup',
    email: email.toLowerCase().trim(),
  });
  if (error) throw new Error(error.message, { cause: error });
}

export async function signIn({ email, password }) {
  const client = requireSupabase();
  const normalizedEmail = email.toLowerCase().trim();
  const { data, error } = await client.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });
  if (error) throw new Error(error.message, { cause: error });
  if (!data?.user || !data.session) throw new Error('The authentication service did not return a signed-in session.');

  let userRecord;
  try {
    userRecord = await loadAccountProfile(client, data.user);
  } catch (profileError) {
    throw new Error('Signed in, but your account profile could not be loaded.', { cause: profileError });
  }
  setLocalItem(LOCAL_STORAGE_KEY_USER, userRecord);
  return { user: userRecord, session: data.session, error: null };
}

export async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message, { cause: error });
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
  } catch (error) {
    throw new Error('Signed out, but the local account cache could not be cleared.', { cause: error });
  }
  return true;
}

export function getCurrentUser() {
  return getLocalItem(LOCAL_STORAGE_KEY_USER, null);
}

export async function updateUserProfile(profile) {
  const client = requireSupabase();
  const { data, error } = await client.auth.updateUser({ data: profile });
  if (error) throw new Error(error.message, { cause: error });
  if (!data?.user) throw new Error('The account service did not return the updated profile.');
  const current = getCurrentUser() || {};
  const updated = { ...current, ...profile, id: data.user.id, email: data.user.email };
  setLocalItem(LOCAL_STORAGE_KEY_USER, updated);
  return updated;
}

export async function saveProgress({ userId, lessonType, lessonId, meta = {} }) {
  const completedAt = new Date().toISOString();
  if (isAuthenticatedUserId(userId)) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('progress')
      .upsert({
        user_id: userId,
        lesson_type: lessonType,
        lesson_id: lessonId,
        completed_at: completedAt,
        meta,
      }, { onConflict: 'user_id,lesson_type,lesson_id' })
      .select('id,user_id,lesson_type,lesson_id,meta,completed_at')
      .single();
    return mapProgress(requirePersistedResult(data, error, 'Lesson progress could not be saved to your account.'));
  }
  const entry = {
    id: `prog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: userId || 'anonymous',
    lessonType,
    lessonId,
    meta,
    completedAt,
  };
  const progressList = getLocalItem(LOCAL_STORAGE_KEY_PROGRESS, []);
  progressList.push(entry);
  setLocalItem(LOCAL_STORAGE_KEY_PROGRESS, progressList);
  return entry;
}

export async function getUserProgress(userId) {
  if (isAuthenticatedUserId(userId)) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('progress')
      .select('id,user_id,lesson_type,lesson_id,meta,completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    if (error) throw new Error('Lesson progress could not be loaded from your account.', { cause: error });
    return (data || []).map(mapProgress);
  }
  const all = getLocalItem(LOCAL_STORAGE_KEY_PROGRESS, []);
  return userId ? all.filter((entry) => entry.userId === userId || entry.userId === 'anonymous') : all;
}

export async function saveCodeSubmission({ userId, title, code, output = '', language = 'yorubascript' }) {
  if (isAuthenticatedUserId(userId)) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('code_submissions')
      .insert({
        user_id: userId,
        title: title || 'Koodu Yorùbá Titun',
        code,
        output,
        language,
      })
      .select('id,user_id,title,code,output,language,created_at')
      .single();
    return mapCodeSubmission(requirePersistedResult(data, error, 'Your code could not be saved to your account.'));
  }
  const submission = {
    id: `code_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: userId || 'anonymous',
    title: title || 'Koodu Yorùbá Titun',
    code,
    output,
    language,
    createdAt: new Date().toISOString(),
  };
  const codeList = getLocalItem(LOCAL_STORAGE_KEY_CODE, []);
  codeList.unshift(submission);
  setLocalItem(LOCAL_STORAGE_KEY_CODE, codeList);
  return submission;
}

export async function getUserCodeSubmissions(userId) {
  if (isAuthenticatedUserId(userId)) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('code_submissions')
      .select('id,user_id,title,code,output,language,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error('Your saved code could not be loaded from your account.', { cause: error });
    return (data || []).map(mapCodeSubmission);
  }
  const all = getLocalItem(LOCAL_STORAGE_KEY_CODE, []);
  return userId ? all.filter((entry) => entry.userId === userId || entry.userId === 'anonymous') : all;
}

export async function saveVoiceRecord({ userId, text, targetLang, audioScore, pitchHz, lessonId = '' }) {
  if (isAuthenticatedUserId(userId)) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('voice_submissions')
      .insert({
        user_id: userId,
        text,
        target_lang: targetLang,
        audio_score: audioScore,
        pitch_hz: pitchHz,
        lesson_id: lessonId,
      })
      .select('id,user_id,text,target_lang,audio_score,pitch_hz,lesson_id,created_at')
      .single();
    return mapVoiceRecord(requirePersistedResult(data, error, 'Your voice practice could not be saved to your account.'));
  }
  const record = {
    id: `voice_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: userId || 'anonymous',
    text,
    targetLang,
    audioScore,
    pitchHz,
    lessonId,
    createdAt: new Date().toISOString(),
  };
  const voiceList = getLocalItem(LOCAL_STORAGE_KEY_VOICE, []);
  voiceList.unshift(record);
  setLocalItem(LOCAL_STORAGE_KEY_VOICE, voiceList);
  return record;
}

export async function getUserVoiceRecords(userId) {
  if (isAuthenticatedUserId(userId)) {
    const client = requireSupabase();
    const { data, error } = await client
      .from('voice_submissions')
      .select('id,user_id,text,target_lang,audio_score,pitch_hz,lesson_id,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error('Your voice practice records could not be loaded from your account.', { cause: error });
    return (data || []).map(mapVoiceRecord);
  }
  const all = getLocalItem(LOCAL_STORAGE_KEY_VOICE, []);
  return userId ? all.filter((entry) => entry.userId === userId || entry.userId === 'anonymous') : all;
}
