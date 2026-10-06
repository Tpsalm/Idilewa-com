import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { ASSETS } from '../../assets/assetsData';
import { RouteType } from '../../types';

export const HomeView: React.FC = () => {
  const { navigate } = useApp();

  const featureCards = [
    { title: 'Learn languages', desc: 'Speak, listen, read and practice.', icon: 'globe', route: 'languages' as RouteType, tone: 'blue', tag: 'Start here', image: 'yoruba-kids-culture.jpg' },
    { title: 'Read & listen', desc: 'Hear words, voices and ideas.', icon: 'headphones', route: 'voices' as RouteType, tone: 'mint', tag: 'Audio & text', image: 'listening-reader.jpg' },
    { title: 'Code in your language', desc: 'Explore technology, side by side.', icon: 'code', route: 'coding' as RouteType, tone: 'yellow', tag: 'Create', image: 'code-kids.jpg' },
    { title: 'Stories & culture', desc: 'Discover stories, people and traditions.', icon: 'book', route: 'ere' as RouteType, tone: 'pink', tag: 'Explore', image: 'ikenga-sculpture.jpg', imageAlt: 'A photorealistic depiction of an Igbo Ikenga sculpture' }
  ];

  const quickStats = [
    { value: '4', label: 'Languages to explore', sub: 'Yorùbá, Igbo, Hausa, Swahili' },
    { value: '60+', label: 'Guided lessons', sub: 'Foundations to conversation' },
    { value: '100%', label: 'Cultural context', sub: 'Built with heritage at the center' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="pill pill-mint hero-kicker">
              <Icon name="sparkles" size={15} /> Preserving culture · Promoting technology
            </span>
            <h1 className="hero-title">
              A gentle digital space for African languages and living culture.
            </h1>
            <p className="hero-subtitle">
              Idilewa brings learning, stories, oral heritage and future-facing skills together in one welcoming home for families, children and lifelong learners.
            </p>
            <div className="hero-actions">
              <a
                href="#/languages"
                className="button button-primary button-lg"
                onClick={(e) => { e.preventDefault(); navigate('languages'); }}
              >
                <span>Start learning</span>
                <Icon name="arrow" size={18} />
              </a>
              <a
                href="#/coding"
                className="button button-secondary button-lg"
                onClick={(e) => { e.preventDefault(); navigate('coding'); }}
              >
                <Icon name="code" size={18} />
                <span>Explore Coding in Yorùbá</span>
              </a>
            </div>
            <div className="hero-stats">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-sub">{stat.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-image-frame">
              <img
                src={ASSETS['hero-reader.jpg']}
                alt="A child happily learning on a tablet with family guidance"
                className="hero-img"
              />
              <div className="hero-badge-floating">
                <Icon name="star" size={18} />
                <span>Yorùbá · Igbo · Hausa · Swahili</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="section-padded container">
        <div className="section-head text-center">
          <span className="section-kicker">How you can learn</span>
          <h2>Explore what Idilewa offers</h2>
          <p className="section-desc">
            Whether you are taking your first steps in a language, sharing stories with your children, or building web projects.
          </p>
        </div>

        <div className="grid grid-4 gap-md">
          {featureCards.map((card, idx) => (
            <a
              key={idx}
              href={`#/${card.route}`}
              className={`feature-card feature-${card.tone}`}
              onClick={(e) => { e.preventDefault(); navigate(card.route); }}
            >
              <div className="feature-card-media">
                <img src={ASSETS[card.image]} alt={card.imageAlt || card.title} />
                <span className="pill feature-tag">{card.tag}</span>
              </div>
              <div className="feature-card-body">
                <div className="feature-card-icon">
                  <Icon name={card.icon} size={22} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="feature-card-link">
                  Explore <Icon name="arrow" size={15} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Community Banner */}
      <section className="section-padded bg-cream">
        <div className="container grid grid-2 gap-lg align-center">
          <div>
            <span className="section-kicker">Built for community</span>
            <h2>Rooted in culture. Designed for today.</h2>
            <p className="text-lead">
              We believe languages are not just subjects to study—they are living ways of understanding ourselves and one another.
            </p>
            <ul className="check-list">
              <li><Icon name="check" size={16} /> Authentic oral literature, proverbs and praise poetry</li>
              <li><Icon name="check" size={16} /> Child-safe spaces with guardian consent and clear controls</li>
              <li><Icon name="check" size={16} /> Bilingual coding missions bringing tech literacy home</li>
            </ul>
            <div className="margin-top-md">
              <a
                href="#/about"
                className="button button-primary"
                onClick={(e) => { e.preventDefault(); navigate('about'); }}
              >
                Learn more about our approach
              </a>
            </div>
          </div>
          <div>
            <img
              src={ASSETS['african-kids-friends.jpg']}
              alt="Young learners sharing stories and smiling together"
              className="border-radius-lg shadow-md"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
