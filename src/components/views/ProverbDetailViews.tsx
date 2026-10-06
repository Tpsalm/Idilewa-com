import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { Proverb } from '../../types';

export const OweView: React.FC = () => {
  const { navigate } = useApp();
  const [proverbs, setProverbs] = useState<Proverb[]>([]);

  useEffect(() => {
    apiService.getProverbs().then((res: { success: boolean; proverbs: Proverb[] }) => {
      if (res.success && res.proverbs) {
        setProverbs(res.proverbs);
      }
    });
  }, []);

  return (
    <div className="container route-page owe-page">
      <div className="breadcrumbs">
        <a href="#/index" onClick={(e) => { e.preventDefault(); navigate('index'); }}>Home</a>
        <span>/</span>
        <a href="#/oral" onClick={(e) => { e.preventDefault(); navigate('oral'); }}>Read & listen</a>
        <span>/</span>
        <strong>Òwe (Proverbs)</strong>
      </div>

      <div className="page-head margin-top-md">
        <span className="section-kicker">Wisdom & Metaphor</span>
        <h1>Òwe: Yorùbá Proverbs</h1>
        <p className="page-desc">
          Proverbs are the horses of speech. When truth is lost, a proverb is used to find it.
        </p>
      </div>

      <div className="grid gap-md margin-top-lg">
        {proverbs.map((p) => (
          <div key={p.id} className="card owe-card">
            <span className="pill pill-mint">{p.language}</span>
            <h2 className="margin-top-xs">{p.text}</h2>
            <p className="font-serif color-muted margin-top-xs">"{p.literal}"</p>
            <p className="margin-top-sm"><strong>Meaning:</strong> {p.meaning}</p>

            <div className="margin-top-md flex gap-sm">
              <button
                className="button button-primary"
                onClick={() => navigate('owe_detail', `id=${p.id}`)}
              >
                Deep Dive & Reflection
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="margin-top-lg">
        <button className="button button-secondary" onClick={() => navigate('owe_add')}>
          + Submit a Proverb
        </button>
      </div>
    </div>
  );
};

export const OweDetailView: React.FC = () => {
  const { currentRoute, navigate } = useApp();
  const params = new URLSearchParams(currentRoute.query);
  const id = params.get('id') || 'owe_1';

  const [proverb, setProverb] = useState<Proverb | null>(null);

  useEffect(() => {
    apiService.getProverbById(id).then((res: { success: boolean; proverb: Proverb }) => {
      if (res.success) setProverb(res.proverb);
    });
  }, [id]);

  if (!proverb) return <div className="container padding-lg">Loading proverb details...</div>;

  return (
    <div className="container route-page owe-detail-page">
      <div className="breadcrumbs">
        <a href="#/index" onClick={(e) => { e.preventDefault(); navigate('index'); }}>Home</a>
        <span>/</span>
        <a href="#/owe" onClick={(e) => { e.preventDefault(); navigate('owe'); }}>Òwe</a>
        <span>/</span>
        <strong>Detail</strong>
      </div>

      <div className="card margin-top-md">
        <span className="pill pill-mint">{proverb.language}</span>
        <h1>{proverb.text}</h1>
        <p className="text-lead color-muted margin-top-xs">"{proverb.literal}"</p>

        <div className="margin-top-md">
          <h3>Meaning & Cultural Context</h3>
          <p className="margin-top-xs">{proverb.meaning}</p>
          <p className="margin-top-xs color-soft">{proverb.context}</p>
        </div>

        <div className="margin-top-md">
          <h3>Story & Origin</h3>
          <p className="margin-top-xs">{proverb.story}</p>
        </div>

        <div className="margin-top-lg flex gap-sm">
          <button className="button button-primary" onClick={() => navigate('owe_story', `id=${proverb.id}`)}>
            Read Story & Quiz
          </button>
          <button className="button button-secondary" onClick={() => navigate('owe_reflection', `id=${proverb.id}`)}>
            Personal Reflection
          </button>
        </div>
      </div>
    </div>
  );
};

export const OweStoryView: React.FC = () => {
  const { navigate, showToast } = useApp();

  return (
    <div className="container route-page owe-story-page">
      <div className="card margin-top-md">
        <h2>Proverb Story & Narrative Context</h2>
        <p className="margin-top-sm text-lead">
          In ancient Yorùbá towns, elders sitting in counsel were judged not by loud declarations, but by their composure and calm speech under pressure...
        </p>

        <div className="margin-top-lg flex gap-sm">
          <button className="button button-primary" onClick={() => { showToast('Comprehension completed!'); navigate('owe'); }}>
            Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export const OweReflectionView: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [reflection, setReflection] = useState('');

  const handleSubmit = () => {
    if (!reflection.trim()) return;
    showToast('Reflection saved to your learning profile!');
    navigate('owe');
  };

  return (
    <div className="container route-page owe-reflection-page">
      <div className="card margin-top-md">
        <h2>Personal Reflection</h2>
        <p className="margin-top-xs">
          How does this proverb relate to your daily life, family, or relationships?
        </p>

        <textarea
          className="input margin-top-md"
          rows={5}
          placeholder="Write your thoughts..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />

        <div className="margin-top-md flex gap-sm">
          <button className="button button-primary" onClick={handleSubmit}>
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  );
};

export const OweAddView: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [text, setText] = useState('');
  const [literal, setLiteral] = useState('');
  const [meaning, setMeaning] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !meaning) return;

    await apiService.addProverb({ text, literal, meaning, language: 'Yorùbá' });
    showToast('Proverb submitted successfully!');
    navigate('owe');
  };

  return (
    <div className="container route-page owe-add-page">
      <div className="card margin-top-md">
        <h2>Submit a Proverb or Oral Quote</h2>
        <form onSubmit={handleSubmit} className="margin-top-md grid gap-sm">
          <div>
            <label className="label">Proverb Text</label>
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} required />
          </div>
          <div>
            <label className="label">Literal Translation</label>
            <input className="input" value={literal} onChange={(e) => setLiteral(e.target.value)} />
          </div>
          <div>
            <label className="label">Deeper Meaning</label>
            <textarea className="input" rows={3} value={meaning} onChange={(e) => setMeaning(e.target.value)} required />
          </div>
          <button type="submit" className="button button-primary margin-top-sm">
            Submit Proverb
          </button>
        </form>
      </div>
    </div>
  );
};
