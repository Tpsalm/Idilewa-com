import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { apiService } from '../../services/api';

export const ConnectTeachersView: React.FC = () => {
  const { showToast } = useApp();
  const [learnerName, setLearnerName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [language, setLanguage] = useState('Yorùbá');
  const [notes, setNotes] = useState('');

  const teachers = [
    { name: 'Adéwálé Ògúnlẹ́yẹ', lang: 'Yorùbá', bio: 'Native Yorùbá speaker with 8+ years teaching children and diaspora learners.' },
    { name: 'Nneka Okeke', lang: 'Igbo', bio: 'Specialist in Igbo oral folklore, conversation, and family learning routines.' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.requestTeacher({ learnerName, guardianName, language, level: 'Beginner', notes });
    showToast('Teacher introduction request sent!');
    setLearnerName('');
    setGuardianName('');
    setNotes('');
  };

  return (
    <div className="container route-page connect-teachers-page">
      <div className="page-head">
        <span className="section-kicker">Community & Mentorship</span>
        <h1>Connect with Verified Teachers</h1>
        <p className="page-desc">
          Find language educators and heritage tutors for personalized guidance.
        </p>
      </div>

      <div className="grid grid-2 gap-lg margin-top-lg">
        <div>
          <h2>Available Tutors</h2>
          <div className="grid gap-md margin-top-md">
            {teachers.map((t, idx) => (
              <div key={idx} className="card">
                <h3>{t.name}</h3>
                <span className="pill pill-mint">{t.lang} Tutor</span>
                <p className="margin-top-xs">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Request a Teacher Introduction</h2>
          <form onSubmit={handleSubmit} className="margin-top-md grid gap-sm">
            <div>
              <label className="label">Learner Name / Nickname</label>
              <input className="input" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Guardian Name</label>
              <input className="input" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Language</label>
              <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="Yorùbá">Yorùbá</option>
                <option value="Igbo">Igbo</option>
                <option value="Hausa">Hausa</option>
                <option value="Swahili">Swahili</option>
              </select>
            </div>
            <div>
              <label className="label">Learning Goals / Notes</label>
              <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <button type="submit" className="button button-primary">
              Send Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ConsentView: React.FC = () => {
  const { state, updateState, showToast } = useApp();
  const [inputCode, setInputCode] = useState('');

  const handleRequestCode = async () => {
    const res = await apiService.requestConsentCode();
    if (res.success) {
      updateState((prev) => ({
        ...prev,
        consent: {
          ...prev.consent,
          requestCode: res.requestCode
        }
      }));
      showToast(`Guardian Code Generated: ${res.requestCode}`);
    }
  };

  const handleVerifyCode = async () => {
    const res = await apiService.verifyConsentCode(inputCode);
    if (res.success) {
      updateState((prev) => ({
        ...prev,
        consent: {
          ...prev.consent,
          approved: true,
          childVerified: true,
          approvedCode: inputCode
        }
      }));
      showToast('Guardian approval verified successfully!');
    } else {
      showToast('Invalid approval code.');
    }
  };

  return (
    <div className="container route-page consent-page">
      <div className="card margin-top-md">
        <span className="section-kicker">Child Safety & Privacy</span>
        <h1>Guardian Consent & Approval</h1>
        <p className="margin-top-xs">
          Idilewa protects young learners with zero data harvesting, child safety controls, and guardian code validation.
        </p>

        <div className="margin-top-lg border-top padding-top-md">
          <h3>1. Generate Guardian Code</h3>
          <button className="button button-secondary margin-top-xs" onClick={handleRequestCode}>
            Generate Code
          </button>
          {state.consent.requestCode && (
            <p className="margin-top-xs font-mono text-lg color-primary">
              Active Code: <strong>{state.consent.requestCode}</strong>
            </p>
          )}
        </div>

        <div className="margin-top-lg border-top padding-top-md">
          <h3>2. Validate Guardian Code</h3>
          <div className="flex gap-sm margin-top-xs">
            <input
              className="input"
              placeholder="Enter 6-digit code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button className="button button-primary" onClick={handleVerifyCode}>
              Verify
            </button>
          </div>
          {state.consent.approved && (
            <p className="margin-top-xs color-success font-bold">
              ✓ Account Verified & Child Safe Controls Active
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const VoicesView: React.FC = () => {
  const { showToast } = useApp();

  const voices = [
    { lang: 'Yorùbá', phrase: 'Ẹ káàárọ̀', translation: 'Good morning', speaker: 'Native Speaker' },
    { lang: 'Igbo', phrase: 'Ndewo', translation: 'Hello', speaker: 'Native Speaker' },
    { lang: 'Hausa', phrase: 'Sannu', translation: 'Hello / Welcome', speaker: 'Native Speaker' }
  ];

  return (
    <div className="container route-page voices-page">
      <div className="page-head">
        <span className="section-kicker">Audio & Pronunciation</span>
        <h1>Voices of Idilewa</h1>
      </div>

      <div className="grid grid-3 gap-md margin-top-lg">
        {voices.map((v, idx) => (
          <div key={idx} className="card">
            <span className="pill pill-mint">{v.lang}</span>
            <h2 className="margin-top-xs">{v.phrase}</h2>
            <p className="color-muted">{v.translation}</p>
            <button
              className="button button-secondary margin-top-md"
              onClick={() => showToast(`Playing ${v.lang} audio: "${v.phrase}"`)}
            >
              <Icon name="play" size={16} /> Listen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PricingView: React.FC = () => {
  const { navigate, showToast } = useApp();

  return (
    <div className="container route-page pricing-page">
      <div className="page-head text-center">
        <span className="section-kicker">Simple, Transparent Pricing</span>
        <h1>Plans for Families, Tutors & Schools</h1>
      </div>

      <div className="grid grid-3 gap-md margin-top-lg">
        <div className="card">
          <h3>Individual</h3>
          <p className="text-2xl font-bold margin-top-xs">Free / Demo</p>
          <p className="margin-top-xs">Access to core language lessons, proverbs and web coding studio.</p>
          <button className="button button-ghost margin-top-md width-full" onClick={() => navigate('languages')}>
            Start Free
          </button>
        </div>

        <div className="card border-primary">
          <span className="pill pill-mint">Most Popular</span>
          <h3>Family Tier</h3>
          <p className="text-2xl font-bold margin-top-xs">$9 / mo</p>
          <p className="margin-top-xs">Up to 5 family profiles, guardian approval dashboard, and offline downloads.</p>
          <button className="button button-primary margin-top-md width-full" onClick={() => showToast('Family plan selected')}>
            Choose Family
          </button>
        </div>

        <div className="card">
          <h3>Institutional</h3>
          <p className="text-2xl font-bold margin-top-xs">Custom</p>
          <p className="margin-top-xs">For schools, cultural centers and heritage organizations.</p>
          <button className="button button-secondary margin-top-md width-full" onClick={() => showToast('Contact sales requested')}>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfileView: React.FC = () => {
  const { state, navigate } = useApp();

  return (
    <div className="container route-page profile-page">
      <div className="card margin-top-md">
        <h1>Your Learning Progress</h1>
        <div className="grid grid-3 gap-md margin-top-md text-center">
          <div className="card bg-cream">
            <span className="text-2xl font-bold">{state.points}</span>
            <p className="color-muted">Total Points / XP</p>
          </div>
          <div className="card bg-cream">
            <span className="text-2xl font-bold">{state.streak}</span>
            <p className="color-muted">Day Streak</p>
          </div>
          <div className="card bg-cream">
            <span className="text-2xl font-bold">{state.completed.length}</span>
            <p className="color-muted">Completed Lessons</p>
          </div>
        </div>

        <div className="margin-top-lg">
          <button className="button button-primary" onClick={() => navigate('languages')}>
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoginView: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Signed in successfully!');
    navigate('profile');
  };

  return (
    <div className="container route-page login-page">
      <div className="card margin-top-md max-width-sm margin-auto">
        <h2>Sign in to Idilewa</h2>
        <form onSubmit={handleLogin} className="margin-top-md grid gap-sm">
          <div>
            <label className="label">Email or Username</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="button button-primary margin-top-xs width-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export const GenericPageView: React.FC<{ pageKey: string }> = ({ pageKey }) => {
  const { navigate } = useApp();

  return (
    <div className="container route-page generic-page">
      <div className="card margin-top-md">
        <span className="section-kicker">Idilewa Platform</span>
        <h1 className="capitalize">{pageKey.replace(/_/g, ' ')}</h1>
        <p className="margin-top-sm">
          Exploring culture, community, and technology in unity.
        </p>
        <div className="margin-top-md">
          <button className="button button-primary" onClick={() => navigate('index')}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};
