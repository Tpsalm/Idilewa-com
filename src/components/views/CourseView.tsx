import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { LANGUAGES_DATA } from './LanguagesView';

export const CourseView: React.FC = () => {
  const { currentRoute, navigate, state, updateState } = useApp();
  
  const params = new URLSearchParams(currentRoute.query);
  const langId = params.get('lang') || state.currentLang;
  const lang = LANGUAGES_DATA.find((l) => l.id === langId) || LANGUAGES_DATA[0];

  const levels = [
    {
      id: 'beginner',
      title: 'Level 1: Everyday Foundations',
      desc: 'Master basic greetings, family terms, numbers, and common courtesy phrases.',
      lessonsCount: 20
    },
    {
      id: 'intermediate',
      title: 'Level 2: Living Conversations',
      desc: 'Build complete sentences, express feelings, ask directions, and describe your day.',
      lessonsCount: 20
    },
    {
      id: 'advanced',
      title: 'Level 3: Cultural Literature & Depth',
      desc: 'Explore proverbs, stories, traditional etiquette, and complex dialogue.',
      lessonsCount: 20
    }
  ];

  const handleSelectLevel = (levelId: string) => {
    updateState((prev) => ({
      ...prev,
      currentLang: lang.id,
      level: levelId as any
    }));
    navigate('lesson', `lang=${lang.id}&level=${levelId}&lesson=1`);
  };

  return (
    <div className="container route-page course-page">
      <div className="breadcrumbs">
        <a href="#/index" onClick={(e) => { e.preventDefault(); navigate('index'); }}>Home</a>
        <span>/</span>
        <a href="#/languages" onClick={(e) => { e.preventDefault(); navigate('languages'); }}>Learn</a>
        <span>/</span>
        <strong>{lang.name}</strong>
      </div>

      <div className="page-head margin-top-md">
        <span className="section-kicker">{lang.native}</span>
        <h1>{lang.name} Learning Path</h1>
        <p className="page-desc">
          Select a level to start practicing pronunciation, vocabulary, and cultural notes.
        </p>
      </div>

      <div className="levels-list grid gap-md margin-top-lg">
        {levels.map((lvl) => {
          const isCurrent = state.level === lvl.id;
          return (
            <div key={lvl.id} className={`card level-card ${isCurrent ? 'level-active' : ''}`}>
              <div className="level-card-head">
                <h3>{lvl.title}</h3>
                <span className="pill pill-mint">{lvl.lessonsCount} Lessons</span>
              </div>
              <p>{lvl.desc}</p>
              <div className="level-card-foot">
                <button
                  className="button button-primary"
                  onClick={() => handleSelectLevel(lvl.id)}
                >
                  <span>Start {lvl.title.split(':')[0]}</span>
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
