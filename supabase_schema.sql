-- ==============================================================================
-- IDILEWA DATABASE SCHEMA & SECURITY POLICIES FOR SUPABASE POSTGRESQL
-- Project: Idilewa (Culturally Immersive Yoruba Full-Stack Web App)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE: PROFILES (User profiles linked directly to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'child' CHECK (role IN ('child', 'adult', 'parent', 'educator', 'institution')),
  consent_code TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 50,
  streak INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to automatically create a profile entry when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, avatar_url, points, streak)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'child'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    50,
    1
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and re-create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 3. TABLE: PROGRESS (Tracks completed curriculum, voice, and coding lessons)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_type TEXT NOT NULL, -- 'learn', 'voice', 'coding', 'vowels', 'consonants', 'owe', 'ifa'
  lesson_id TEXT NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_type, lesson_id)
);

-- Index for fast user progress lookup
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON public.progress (user_id, lesson_type);

-- RLS for Progress
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" 
  ON public.progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own progress" 
  ON public.progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress" 
  ON public.progress FOR UPDATE 
  USING (auth.uid() = user_id);


-- ==============================================================================
-- 4. TABLE: CODE_SUBMISSIONS (Stores kid's Yoruba code creations & sandbox scripts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.code_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Koodu Yorùbá Titun',
  code TEXT NOT NULL,
  language TEXT DEFAULT 'yorubascript', -- 'yorubascript', 'edekoodu'
  output TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user code submissions
CREATE INDEX IF NOT EXISTS idx_code_submissions_user ON public.code_submissions (user_id, created_at DESC);

-- RLS for Code Submissions
ALTER TABLE public.code_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own code submissions" 
  ON public.code_submissions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own code submissions" 
  ON public.code_submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own code submissions" 
  ON public.code_submissions FOR DELETE 
  USING (auth.uid() = user_id);


-- ==============================================================================
-- 5. TABLE: VOICE_SUBMISSIONS (Stores speech pitch, tones, and voice recordings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.voice_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  target_lang TEXT DEFAULT 'yo', -- 'yo', 'ig', 'ha'
  audio_score NUMERIC DEFAULT 100,
  pitch_hz NUMERIC DEFAULT 0,
  lesson_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user voice records
CREATE INDEX IF NOT EXISTS idx_voice_submissions_user ON public.voice_submissions (user_id, created_at DESC);

-- RLS for Voice Submissions
ALTER TABLE public.voice_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own voice submissions" 
  ON public.voice_submissions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own voice submissions" 
  ON public.voice_submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);


-- ==============================================================================
-- 6. TABLE: COMMUNITY_PROVERBS (Optional community additions & reflections)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_proverbs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  yoruba TEXT NOT NULL,
  literal TEXT,
  meaning TEXT,
  context TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_proverbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved proverbs" 
  ON public.community_proverbs FOR SELECT 
  USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can submit proverbs" 
  ON public.community_proverbs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
