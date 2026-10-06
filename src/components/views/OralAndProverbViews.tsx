import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { ASSETS } from '../../assets/assetsData';
import { RouteType } from '../../types';

// Oral Main View
export const OralView: React.FC = () => {
  const { navigate } = useApp();

  const genres = [
    { title: 'Oríkì', titleSub: 'Praise poetry', copy: 'Explore poetic praise, identity and remembrance through context and community voices.', icon: 'quote', route: 'oriki' as RouteType, tone: 'peach' },
    { title: 'Òwe', titleSub: 'Proverbs', copy: 'Notice how metaphors carry social guidance, emotional restraint and shared memory.', icon: 'book', route: 'owe' as RouteType, tone: 'mint' },
    { title: 'Ẹ̀rẹ́ & Folktales', titleSub: 'Living lore', copy: 'Interactive stories and moral folktales passed down through generations.', icon: 'sparkles', route: 'ere' as RouteType, tone: 'blue' }
  ];

  return (
    <div className="container route-page oral-page">
      <div className="breadcrumbs">
        <a href="#/index" onClick={(e) => { e.preventDefault(); navigate('index'); }}>Home</a>
        <span>/</span>
        <strong>Read & listen</strong>
      </div>

      <div className="page-head margin-top-md">
        <span className="section-kicker">Oral Literature & Memory</span>
        <h1>Living voices, proverbs and poetry</h1>
        <p className="page-desc">
          Oral literature carries history, etiquette, values, and artistic expression across generations.
        </p>
      </div>

      <div className="grid grid-3 gap-md margin-top-lg">
        {genres.map((g, idx) => (
          <div key={idx} className={`card feature-card feature-${g.tone}`}>
            <div className="feature-card-body">
              <div className="feature-card-icon"><Icon name={g.icon} size={22} /></div>
              <h3>{g.title} <small>({g.titleSub})</small></h3>
              <p>{g.copy}</p>
              <button
                className="button button-primary margin-top-md"
                onClick={() => navigate(g.route)}
              >
                Explore {g.title}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Oriki Poetry View
export const OrikiView: React.FC = () => {
  const { navigate, setAiDrawerOpen } = useApp();

  return (
    <div className="container route-page oriki-page">
      <div className="breadcrumbs">
        <a href="#/index" onClick={(e) => { e.preventDefault(); navigate('index'); }}>Home</a>
        <span>/</span>
        <a href="#/oral" onClick={(e) => { e.preventDefault(); navigate('oral'); }}>Read & listen</a>
        <span>/</span>
        <strong>Oríkì</strong>
      </div>

      <div className="card margin-top-md">
        <span className="section-kicker">Praise Poetry & Heritage</span>
        <h1>Oríkì: Poetic Identity</h1>
        <p className="margin-top-sm">
          Oríkì is a genre of Yorùbá praise poetry used to honor lineages, individuals, towns, and noble character traits.
        </p>

        <div className="poetry-box margin-top-md bg-paper padding-md border-radius-sm">
          <p className="font-serif text-lg" style={{ fontStyle: 'italic', lineHeight: '1.8' }}>
            "Ajàní ògún, ọmọ aládé ìgbó...<br />
            Ẹni tí ń fi ìwà rere ṣe ọ̀ṣọ́ ilé."
          </p>
          <p className="color-muted margin-top-sm">
            Translation: "Ajani, offspring of the forest realm... One who adorns home with noble character."
          </p>
        </div>

        <div className="margin-top-md flex gap-sm">
          <button className="button button-primary" onClick={() => setAiDrawerOpen(true)}>
            <Icon name="sparkles" size={16} /> Think alongside Oríkì with AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

// Ere / Folklore View
export const EreView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="container route-page ere-page">
      <div className="breadcrumbs">
        <a href="#/index" onClick={(e) => { e.preventDefault(); navigate('index'); }}>Home</a>
        <span>/</span>
        <strong>Ẹ̀rẹ́ & Stories</strong>
      </div>

      <div className="page-head margin-top-md">
        <span className="section-kicker">Interactive Lore</span>
        <h1>Ẹ̀rẹ́: Folktales, Songs & Play</h1>
        <p className="page-desc">
          Stories and riddle games that teach moral lessons, wisdom, and community values.
        </p>
      </div>

      <div className="card margin-top-md grid grid-2 gap-md align-center">
        <div>
          <h3>Tortoise & The Wise Elephant</h3>
          <p className="margin-top-xs">
            A classic Yorùbá trickster tale demonstrating wit, humility, and community lessons.
          </p>
          <button className="button button-primary margin-top-md" onClick={() => navigate('ere_game')}>
            Play / Read Story Game
          </button>
        </div>
        <div>
          <img src={ASSETS['story-grandmother.jpg']} alt="Storytelling session" className="border-radius-md" />
        </div>
      </div>
    </div>
  );
};

// Ere Game View
export const EreGameView: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [step, setStep] = useState(0);

  const storySteps = [
    { title: 'The Assembly of Animals', text: 'Long ago, the animals gathered under the baobab tree to solve a drought...' },
    { title: 'Ijapa the Tortoise', text: 'Ijapa proposed a riddle to find hidden water underground...' },
    { title: 'The Moral Lesson', text: 'Wisdom is shared, not hoarded. Respect for elders and community brings abundance.' }
  ];

  return (
    <div className="container route-page ere-game-page">
      <div className="card margin-top-md">
        <h2>{storySteps[step].title}</h2>
        <p className="text-lead margin-top-sm">{storySteps[step].text}</p>

        <div className="margin-top-lg flex gap-sm">
          {step < storySteps.length - 1 ? (
            <button className="button button-primary" onClick={() => setStep(step + 1)}>
              Next Part <Icon name="arrow" size={16} />
            </button>
          ) : (
            <button className="button button-primary" onClick={() => { showToast('Story completed!'); navigate('ere'); }}>
              Finish Story
            </button>
          )}
          <button className="button button-ghost" onClick={() => navigate('ere')}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};
