import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icon';
import { RouteType } from '../../types';

const SEARCH_DATA: Array<{ label: string; desc: string; route: RouteType; type: string }> = [
  { label: 'Yorùbá Language & Culture', desc: 'Alphabet, greetings, grammar and living stories.', route: 'languages', type: 'Learn' },
  { label: 'Coding in Yorùbá', desc: 'HTML, JavaScript, Python and Web fundamentals with Yorùbá helpers.', route: 'coding', type: 'Technology' },
  { label: 'Òwe (Proverbs)', desc: 'Ancestral Yorùbá wisdom, metaphors and reflections.', route: 'owe', type: 'Culture' },
  { label: 'Oríkì (Praise Poetry)', desc: 'Poetic attributes, lineages and ancestral honor.', route: 'oriki', type: 'Literature' },
  { label: 'Ẹ̀rẹ́ (Folktales & Games)', desc: 'Interactive games, stories and moral lessons.', route: 'ere', type: 'Interactive' },
  { label: 'Connect with Teachers', desc: 'Find language educators and community tutors.', route: 'connect_teachers', type: 'Community' },
  { label: 'Guardian Consent', desc: 'Safe child account setup and verification.', route: 'consent', type: 'Safety' },
  { label: 'Pricing & Plans', desc: 'Individual, family and institutional access tiers.', route: 'pricing', type: 'Platform' }
];

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, navigate } = useApp();
  const [query, setQuery] = useState('');

  if (!searchOpen) return null;

  const filtered = SEARCH_DATA.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-overlay" onClick={() => setSearchOpen(false)}>
      <section
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search Idilewa"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-dialog-head">
          <span><Icon name="search" size={19} /></span>
          <input
            id="siteSearch"
            type="search"
            placeholder="Search languages, stories, culture…"
            autoComplete="off"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="icon-button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="search-results" id="searchResults">
          {filtered.length === 0 ? (
            <div className="search-empty">No results matching "{query}"</div>
          ) : (
            filtered.map((item) => (
              <a
                key={item.route}
                className="search-result-item"
                href={`#/${item.route}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSearchOpen(false);
                  navigate(item.route);
                }}
              >
                <div className="search-result-info">
                  <span className="search-result-title">{item.label}</span>
                  <span className="search-result-desc">{item.desc}</span>
                </div>
                <span className="pill search-result-type">{item.type}</span>
              </a>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
