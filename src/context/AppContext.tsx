import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, RouteType } from '../types';

export const DEFAULT_STATE: AppState = {
  currentLang: 'yoruba',
  level: 'beginner',
  points: 0,
  streak: 0,
  completed: [],
  lessonResponses: {},
  quizResults: {},
  rewarded: {},
  saved: [],
  savedProverbs: [],
  reflections: [],
  reflectionFeeling: '',
  teacherRequests: [],
  teacherReplies: [],
  teacherFilter: 'all',
  interested: [],
  available: { yoruba: true, igbo: true, hausa: true, swahili: true, twi: false, wolof: false, zulu: false, fulfulde: false },
  loginMode: 'signin',
  billing: 'monthly',
  consent: {
    requestCode: '', approvedCode: '', approved: false,
    learnerAlias: 'Young learner', accountApproved: false,
    tutorApproved: false, tutorId: '', childVerified: false,
    tutorValidatedFor: '', assignmentAccepted: false,
    requestedAt: '', approvedAt: '', expiresAt: 0
  },
  coding: {
    stage: 0, techId: 'html', level: 'beginner', missionId: 'hello',
    helperLanguage: 'yoruba', search: '', points: 0, streak: 0,
    lastPracticeDate: '', completed: [], draft: '', result: '',
    questCommands: [], questTrail: [], questResult: ''
  }
};

function loadInitialState(): AppState {
  try {
    const stored = JSON.parse(localStorage.getItem('idilewa-demo-state') || '{}');
    const merged: AppState = {
      ...DEFAULT_STATE,
      ...stored,
      available: { ...DEFAULT_STATE.available, ...(stored.available || {}) },
      consent: { ...DEFAULT_STATE.consent, ...(stored.consent || {}) },
      coding: {
        ...DEFAULT_STATE.coding,
        ...(stored.coding || {}),
        completed: Array.isArray(stored.coding?.completed) ? stored.coding.completed : [],
        questCommands: Array.isArray(stored.coding?.questCommands) ? stored.coding.questCommands.filter((step: string) => ['up', 'right', 'down', 'left'].includes(step)).slice(0, 12) : [],
        questTrail: Array.isArray(stored.coding?.questTrail) ? stored.coding.questTrail : [],
        questResult: typeof stored.coding?.questResult === 'string' ? stored.coding.questResult : '',
        search: typeof stored.coding?.search === 'string' ? stored.coding.search : '',
        draft: typeof stored.coding?.draft === 'string' ? stored.coding.draft : '',
        result: typeof stored.coding?.result === 'string' ? stored.coding.result : ''
      },
      lessonResponses: { ...(stored.lessonResponses || {}) },
      quizResults: { ...(stored.quizResults || {}) },
      rewarded: { ...(stored.rewarded || {}) },
      saved: Array.isArray(stored.saved) ? stored.saved : [],
      savedProverbs: Array.isArray(stored.savedProverbs) ? stored.savedProverbs : [],
      reflections: Array.isArray(stored.reflections) ? stored.reflections : [],
      teacherRequests: Array.isArray(stored.teacherRequests) ? stored.teacherRequests : [],
      teacherReplies: Array.isArray(stored.teacherReplies) ? stored.teacherReplies : [],
      teacherFilter: typeof stored.teacherFilter === 'string' ? stored.teacherFilter : 'all',
      reflectionFeeling: typeof stored.reflectionFeeling === 'string' ? stored.reflectionFeeling : '',
      completed: Array.isArray(stored.completed) ? stored.completed : DEFAULT_STATE.completed.slice(),
      interested: Array.isArray(stored.interested) ? stored.interested : []
    };

    if (merged.level as string === 'growing') merged.level = 'intermediate';
    if (merged.level as string === 'fluent') merged.level = 'advanced';
    if (!['beginner', 'intermediate', 'advanced'].includes(merged.level)) merged.level = 'beginner';

    return merged;
  } catch {
    return DEFAULT_STATE;
  }
}

interface Toast {
  id: string;
  message: string;
}

interface ModalConfig {
  title: string;
  content: string | React.ReactNode;
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateState: (updater: (prev: AppState) => AppState) => void;
  currentRoute: { page: RouteType; query: string };
  navigate: (route: RouteType, query?: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aiDrawerOpen: boolean;
  setAiDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: ModalConfig | null;
  openModal: (title: string, content: string | React.ReactNode) => void;
  closeModal: () => void;
  toasts: Toast[];
  showToast: (message: string) => void;
  activeTutorProfile: string | null;
  setActiveTutorProfile: React.Dispatch<React.SetStateAction<string | null>>;
  activeLearnerProfile: string | null;
  setActiveLearnerProfile: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadInitialState);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalConfig | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTutorProfile, setActiveTutorProfile] = useState<string | null>(null);
  const [activeLearnerProfile, setActiveLearnerProfile] = useState<string | null>(null);

  const parseHash = (): { page: RouteType; query: string } => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const [pageRaw, queryRaw] = hash.split('?');
    const page = (pageRaw || 'index') as RouteType;
    return { page, query: queryRaw || '' };
  };

  const [currentRoute, setCurrentRoute] = useState<{ page: RouteType; query: string }>(parseHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('idilewa-demo-state', JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      return next;
    });
  };

  const navigate = (route: RouteType, query?: string) => {
    const q = query ? `?${query}` : '';
    window.location.hash = `#/${route}${q}`;
    setMobileMenuOpen(false);
  };

  const openModal = (title: string, content: string | React.ReactNode) => {
    setActiveModal({ title, content });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        updateState,
        currentRoute,
        navigate,
        mobileMenuOpen,
        setMobileMenuOpen,
        searchOpen,
        setSearchOpen,
        aiDrawerOpen,
        setAiDrawerOpen,
        activeModal,
        openModal,
        closeModal,
        toasts,
        showToast,
        activeTutorProfile,
        setActiveTutorProfile,
        activeLearnerProfile,
        setActiveLearnerProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
