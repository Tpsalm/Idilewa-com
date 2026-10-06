import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { LANGUAGES_DATA } from './LanguagesView';

export const LessonView: React.FC = () => {
  const { currentRoute, navigate, state, updateState, showToast } = useApp();
  const params = new URLSearchParams(currentRoute.query);
  const langId = params.get('lang') || state.currentLang;
  const lang = LANGUAGES_DATA.find((l) => l.id === langId) || LANGUAGES_DATA[0];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const sampleLesson = {
    title: 'Lesson 1: Morning Greetings & Courtesies',
    prompt: `How do you say "Good morning" politely in ${lang.name}?`,
    phrase: lang.greeting,
    translation: lang.translation,
    options: [lang.greeting, lang.hello, 'Ẹ ṣeun', 'Ó dàbọ̀'],
    correctIndex: 0
  };

  const handlePlayAudio = () => {
    showToast(`Playing audio: "${sampleLesson.phrase}"`);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    if (selectedOption === sampleLesson.correctIndex) {
      updateState((prev) => ({
        ...prev,
        points: prev.points + 10,
        streak: prev.streak + 1,
        completed: [...new Set([...prev.completed, `lesson_${lang.id}_1`])]
      }));
      showToast('Correct! +10 points');
    } else {
      showToast('Not quite right. Try again!');
    }
  };

  return (
    <div className="container route-page lesson-page">
      <div className="breadcrumbs">
        <a href="#/index" onClick={(e) => { e.preventDefault(); navigate('index'); }}>Home</a>
        <span>/</span>
        <a href={`#/${lang.id}`} onClick={(e) => { e.preventDefault(); navigate('course', `lang=${lang.id}`); }}>{lang.name}</a>
        <span>/</span>
        <strong>Lesson 1</strong>
      </div>

      <div className="card lesson-card margin-top-md">
        <div className="lesson-head">
          <span className="pill pill-mint">{lang.name} · Level 1</span>
          <h2>{sampleLesson.title}</h2>
        </div>

        <div className="lesson-audio-box margin-top-md">
          <button className="button button-secondary" onClick={handlePlayAudio}>
            <Icon name="play" size={18} />
            <span>Listen: "{sampleLesson.phrase}" ({sampleLesson.translation})</span>
          </button>
        </div>

        <div className="lesson-quiz margin-top-lg">
          <h3>{sampleLesson.prompt}</h3>
          <div className="quiz-options grid grid-2 gap-sm margin-top-sm">
            {sampleLesson.options.map((opt, idx) => (
              <button
                key={idx}
                className={`button ${selectedOption === idx ? 'button-primary' : 'button-soft'} quiz-opt-btn`}
                onClick={() => setSelectedOption(idx)}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="margin-top-md flex gap-sm">
            <button
              className="button button-primary"
              disabled={selectedOption === null}
              onClick={handleCheckAnswer}
            >
              Check Answer
            </button>

            <button
              className="button button-ghost"
              onClick={() => navigate('course', `lang=${lang.id}`)}
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
