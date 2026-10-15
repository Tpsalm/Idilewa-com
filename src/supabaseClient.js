// Supabase Database & Auth client with offline fallback
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export let supabase = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (err) {
  console.warn('[Idilewa DB] Supabase client initialization fallback to local storage:', err);
}
export const isSupabaseConfigured = Boolean(
  import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY
);

const LOCAL_STORAGE_KEY_USER = 'idilewa_auth_user';
const LOCAL_STORAGE_KEY_PROGRESS = 'idilewa_db_progress';
const LOCAL_STORAGE_KEY_CODE = 'idilewa_db_code';
const LOCAL_STORAGE_KEY_VOICE = 'idilewa_db_voice';

function getLocalItem(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

export async function signUp({ email, password, name, role = 'child', guardianAccessRequestId }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Authentication is not configured. Set the Supabase URL and anon key before creating accounts.');
  }
  if (role === 'child' && !/^[0-9a-f-]{36}$/i.test(guardianAccessRequestId || '')) {
    throw new Error('A verified guardian approval is required before creating a child account.');
  }
  const normalizedEmail = email.toLowerCase().trim();
  const userName = name || normalizedEmail.split('@')[0];
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        name: userName,
        role,
        ...(role === 'child' ? { guardian_access_request_id: guardianAccessRequestId } : {}),
      },
    },
  });
  if (error) throw new Error(error.message);
  if (!data?.user) throw new Error('The authentication service did not return an account.');

  const userRecord = {
    id: data.user.id,
    email: normalizedEmail,
    name: userName,
    role,
    avatar: '',
    createdAt: data.user.created_at || new Date().toISOString(),
    points: 0,
    streak: 0,
  };
  if (data.session) setLocalItem(LOCAL_STORAGE_KEY_USER, userRecord);
  return { user: userRecord, session: data.session, error: null };
}

export async function signIn({ email, password }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Authentication is not configured. Set the Supabase URL and anon key before signing in.');
  }
  const normalizedEmail = email.toLowerCase().trim();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });
  if (error) throw new Error(error.message);
  if (!data?.user || !data.session) throw new Error('The authentication service did not return a signed-in session.');
  const user = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
    role: data.user.user_metadata?.role || 'adult',
    avatar: data.user.user_metadata?.avatar_url || '',
    points: 0,
    streak: 0,
  };
  setLocalItem(LOCAL_STORAGE_KEY_USER, user);
  return { user, session: data.session, error: null };
}

export async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
  return true;
}

export function getCurrentUser() {
  return getLocalItem(LOCAL_STORAGE_KEY_USER, null);
}

export async function saveProgress({ userId, lessonType, lessonId, meta = {} }) {
  const progressList = getLocalItem(LOCAL_STORAGE_KEY_PROGRESS, []);
  const entry = {
    id: `prog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: userId || 'anonymous',
    lessonType,
    lessonId,
    meta,
    completedAt: new Date().toISOString(),
  };

  progressList.push(entry);
  setLocalItem(LOCAL_STORAGE_KEY_PROGRESS, progressList);

  if (supabase && userId && !userId.startsWith('usr_')) {
    try {
      await supabase.from('progress').upsert({
        user_id: userId,
        lesson_type: lessonType,
        lesson_id: lessonId,
        completed_at: entry.completedAt,
        meta: JSON.stringify(meta),
      });
    } catch (_) {}
  }

  return entry;
}

export function getUserProgress(userId) {
  const all = getLocalItem(LOCAL_STORAGE_KEY_PROGRESS, []);
  if (!userId) return all;
  return all.filter((p) => p.userId === userId || p.userId === 'anonymous');
}

export async function saveCodeSubmission({ userId, title, code, output = '', language = 'yorubascript' }) {
  const codeList = getLocalItem(LOCAL_STORAGE_KEY_CODE, []);
  const submission = {
    id: `code_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: userId || 'anonymous',
    title: title || 'Koodu Yorùbá Titun',
    code,
    output,
    language,
    createdAt: new Date().toISOString(),
  };

  codeList.unshift(submission);
  setLocalItem(LOCAL_STORAGE_KEY_CODE, codeList);

  if (supabase && userId && !userId.startsWith('usr_')) {
    try {
      await supabase.from('code_submissions').insert({
        user_id: userId,
        code,
        language,
        created_at: submission.createdAt,
      });
    } catch (_) {}
  }

  return submission;
}

export function getUserCodeSubmissions(userId) {
  const all = getLocalItem(LOCAL_STORAGE_KEY_CODE, []);
  if (!userId) return all;
  return all.filter((c) => c.userId === userId || c.userId === 'anonymous');
}

export async function saveVoiceRecord({ userId, text, targetLang, audioScore, pitchHz, lessonId = '' }) {
  const voiceList = getLocalItem(LOCAL_STORAGE_KEY_VOICE, []);
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

  voiceList.unshift(record);
  setLocalItem(LOCAL_STORAGE_KEY_VOICE, voiceList);

  if (supabase && userId && !userId.startsWith('usr_')) {
    try {
      await supabase.from('voice_submissions').insert({
        user_id: userId,
        text,
        target_lang: targetLang,
        audio_score: audioScore,
        pitch_hz: pitchHz,
        lesson_id: lessonId,
        created_at: record.createdAt,
      });
    } catch (_) {}
  }

  return record;
}

export function getUserVoiceRecords(userId) {
  const all = getLocalItem(LOCAL_STORAGE_KEY_VOICE, []);
  if (!userId) return all;
  return all.filter((v) => v.userId === userId || v.userId === 'anonymous');
}
