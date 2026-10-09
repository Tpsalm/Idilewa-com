// Supabase Database & Auth client with offline fallback
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://baxlxprxjwntqodrpsjm.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJheGx4cHJ4andudHFvZHJwc2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjA0ODksImV4cCI6MjEwNzAzNjQ4OX0.HZjZUT5GYz5EQG1tAw-tex25Yx3RYu_ilF15tCJ0bbU';

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

const LOCAL_STORAGE_KEY_USER = 'idilewa_auth_user';
const LOCAL_STORAGE_KEY_USERS = 'idilewa_db_users';
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

export async function signUp({ email, password, name, role = 'child', consentCode = '' }) {
  const normalizedEmail = email.toLowerCase().trim();
  const userName = name || normalizedEmail.split('@')[0];

  let supabaseUser = null;
  let supabaseError = null;

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: userName,
            role,
            consentCode,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
          },
        },
      });
      if (error) {
        supabaseError = error.message;
      } else if (data?.user) {
        supabaseUser = data.user;
        // Optionally insert profile to profiles table
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: normalizedEmail,
            name: userName,
            role,
            consent_code: consentCode,
            updated_at: new Date().toISOString(),
          });
        } catch (_) {}
      }
    } catch (e) {
      supabaseError = e.message;
    }
  }

  // Fallback / local store
  const localUsers = getLocalItem(LOCAL_STORAGE_KEY_USERS, []);
  const existing = localUsers.find((u) => u.email === normalizedEmail);

  if (existing && !supabaseUser) {
    throw new Error('Imeeli yii ti wa ni lilo tẹlẹ (This email is already registered).');
  }

  const userRecord = {
    id: supabaseUser?.id || 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    email: normalizedEmail,
    name: userName,
    role,
    consentCode,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
    createdAt: new Date().toISOString(),
    points: 50,
    streak: 1,
  };

  if (!existing) {
    localUsers.push({ ...userRecord, passwordHash: btoa(password) });
    setLocalItem(LOCAL_STORAGE_KEY_USERS, localUsers);
  }

  setLocalItem(LOCAL_STORAGE_KEY_USER, userRecord);
  return { user: userRecord, error: null };
}

export async function signIn({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  let supabaseUser = null;

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (!error && data?.user) {
        supabaseUser = data.user;
      }
    } catch (_) {}
  }

  const localUsers = getLocalItem(LOCAL_STORAGE_KEY_USERS, []);
  const localMatch = localUsers.find((u) => u.email === normalizedEmail);

  if (!supabaseUser && !localMatch) {
    // Quick demo convenience: allow any valid email/password in demo mode
    const demoUser = {
      id: 'usr_' + Date.now().toString(36),
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: 'child',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      createdAt: new Date().toISOString(),
      points: 40,
      streak: 1,
    };
    localUsers.push({ ...demoUser, passwordHash: btoa(password) });
    setLocalItem(LOCAL_STORAGE_KEY_USERS, localUsers);
    setLocalItem(LOCAL_STORAGE_KEY_USER, demoUser);
    return { user: demoUser, error: null };
  }

  const user = supabaseUser
    ? {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        role: supabaseUser.user_metadata?.role || 'child',
        avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(supabaseUser.email || '')}`,
        points: 100,
        streak: 2,
      }
    : localMatch;

  setLocalItem(LOCAL_STORAGE_KEY_USER, user);
  return { user, error: null };
}

export async function signOut() {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
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
  return record;
}

export function getUserVoiceRecords(userId) {
  const all = getLocalItem(LOCAL_STORAGE_KEY_VOICE, []);
  if (!userId) return all;
  return all.filter((v) => v.userId === userId || v.userId === 'anonymous');
}
