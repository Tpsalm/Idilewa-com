import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { Language, SoonLanguage } from '../../types';

export const LANGUAGES_DATA: Language[] = [
  { id: 'yoruba', name: 'Yorùbá', native: 'Èdè Yorùbá', greeting: 'Ẹ káàárọ̀', hello: 'Báwo ni?', translation: 'Good morning', glyph: 'È', region: 'Nigeria · Benin · Togo', tint: 'mint', lessons: '60 lessons · 3 levels' },
  { id: 'igbo', name: 'Igbo', native: 'Asụsụ Igbo', greeting: 'Ndewo', hello: 'Kedu?', translation: 'Hello', glyph: 'Ị', region: 'South-eastern Nigeria', tint: 'peach', lessons: '60 lessons · 3 levels' },
  { id: 'hausa', name: 'Hausa', native: 'Harshen Hausa', greeting: 'Sannu', hello: 'Yaya dai?', translation: 'Hello', glyph: 'H', region: 'West & Central Africa', tint: 'blue', lessons: '60 lessons · 3 levels' },
  { id: 'swahili', name: 'Swahili', native: 'Kiswahili', greeting: 'Habari', hello: 'Hujambo?', translation: 'How are you?', glyph: 'S', region: 'East Africa', tint: 'lilac', lessons: '60 lessons · 3 levels' }
];

export const SOON_LANGUAGES_DATA: SoonLanguage[] = [
  { id: 'twi', name: 'Twi', region: 'Ghana', glyph: 'T' },
  { id: 'wolof', name: 'Wolof', region: 'Senegal · The Gambia', glyph: 'W' },
  { id: 'zulu', name: 'isiZulu', region: 'Southern Africa', glyph: 'Z' },
  { id: 'fulfulde', name: 'Fulfulde', region: 'Across the Sahel', glyph: 'F' }
];

export const LanguagesView: React.FC = () => {
  const { navigate, state, updateState, showToast } = useApp();

  const handleSelectLanguage = (langId: string) => {
    updateState((prev) => ({ ...prev, currentLang: langId }));
    navigate('course', `lang=${langId}`);
  };

  const handleNotifyLanguage = (langId: string) => {
    const isSaved = state.interested.includes(langId);
    if (isSaved) {
      updateState((prev) => ({
        ...prev,
        interested: prev.interested.filter((id) => id !== langId)
      }));
      showToast('Removed from interest list');
    } else {
      updateState((prev) => ({
        ...prev,
        interested: [...prev.interested, langId]
      }));
      showToast('We will notify you when this language arrives!');
    }
  };

  return (
    <div className="container route-page languages-page">
      <div className="page-head">
        <span className="section-kicker">Choose a language path</span>
        <h1>Welcome to language learning on Idilewa</h1>
        <p className="page-desc">
          Every path is designed with clear audio, everyday words, cultural context and family-friendly pacing.
        </p>
      </div>

      <div className="languages-grid grid grid-2 gap-md margin-top-lg">
        {LANGUAGES_DATA.map((l) => {
          const available = !!state.available[l.id];
          return (
            <article key={l.id} className={`language-choice lang-${l.tint} ${available ? '' : 'is-coming'}`}>
              <div className="language-choice-top">
                <span className="language-glyph">{l.glyph}</span>
                <span className={`pill ${available ? 'pill-mint' : 'pill-warm'}`}>
                  {available ? 'Available' : 'Coming soon'}
                </span>
              </div>
              <h3>{l.name}</h3>
              <p className="native-name">{l.native}</p>
              <p className="language-region">{l.region}</p>
              <div className="language-choice-meta">
                <span><Icon name="book" size={15} /> {l.lessons}</span>
                <span><Icon name="headphones" size={15} /> Listen & speak</span>
              </div>
              <button
                className={`button width-full ${available ? 'button-primary' : 'button-soft'} language-start`}
                onClick={() => handleSelectLanguage(l.id)}
              >
                <span>{available ? `Start learning ${l.name}` : `Preview ${l.name}`}</span>
                <Icon name="arrow" size={16} />
              </button>
            </article>
          );
        })}
      </div>

      <div className="section-padded margin-top-lg">
        <div className="section-head">
          <span className="section-kicker">More languages in development</span>
          <h2>Expanding African heritage languages</h2>
        </div>
        <div className="soon-languages-list grid grid-2 gap-sm">
          {SOON_LANGUAGES_DATA.map((l) => {
            const isSaved = state.interested.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                className="soon-language"
                onClick={() => handleNotifyLanguage(l.id)}
              >
                <span className="soon-glyph">{l.glyph}</span>
                <span className="soon-copy">
                  <strong>{l.name}</strong>
                  <small>{l.region}</small>
                </span>
                <span className="soon-badge">{isSaved ? 'Saved' : 'Coming soon'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
