import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-block">
          <a
            className="brand footer-brand"
            href="#/index"
            onClick={(e) => { e.preventDefault(); navigate('index'); }}
          >
            <span className="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
            <span className="brand-copy">
              <span className="brand-word">idílẹ́wà</span>
              <span className="brand-caption">Language · culture · future</span>
            </span>
          </a>
          <p>Èdè wa, àṣà wa, ìdílé wa.<br />Our language. Our culture. Our family.</p>
        </div>

        <div className="footer-links">
          <h3>Learn</h3>
          <ul>
            <li><a href="#/languages" onClick={(e) => { e.preventDefault(); navigate('languages'); }}>All languages</a></li>
            <li><a href="#/coding" onClick={(e) => { e.preventDefault(); navigate('coding'); }}>Coding in Yorùbá</a></li>
            <li><a href="#/kids" onClick={(e) => { e.preventDefault(); navigate('kids'); }}>Young learners</a></li>
            <li><a href="#/individuals" onClick={(e) => { e.preventDefault(); navigate('individuals'); }}>Adults & Diaspora</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Culture & Wisdom</h3>
          <ul>
            <li><a href="#/oral" onClick={(e) => { e.preventDefault(); navigate('oral'); }}>Oral traditions</a></li>
            <li><a href="#/owe" onClick={(e) => { e.preventDefault(); navigate('owe'); }}>Òwe (Proverbs)</a></li>
            <li><a href="#/oriki" onClick={(e) => { e.preventDefault(); navigate('oriki'); }}>Oríkì praise poetry</a></li>
            <li><a href="#/ere" onClick={(e) => { e.preventDefault(); navigate('ere'); }}>Folktakes & Games</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Community & Purpose</h3>
          <ul>
            <li><a href="#/families" onClick={(e) => { e.preventDefault(); navigate('families'); }}>For families</a></li>
            <li><a href="#/connect_teachers" onClick={(e) => { e.preventDefault(); navigate('connect_teachers'); }}>Connect with teachers</a></li>
            <li><a href="#/about" onClick={(e) => { e.preventDefault(); navigate('about'); }}>About Idilewa</a></li>
            <li><a href="#/consent" onClick={(e) => { e.preventDefault(); navigate('consent'); }}>Guardian consent</a></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Idilewa. Preserving culture. Promoting technology.</p>
      </div>
    </footer>
  );
};
