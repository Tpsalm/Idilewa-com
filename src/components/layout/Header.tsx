import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { NavItem } from '../../types';

const NAV: NavItem[] = [
  { label: 'Home', route: 'index', group: 'home' },
  { label: 'Learn', route: 'languages', group: 'learn' },
  { label: 'Read & listen', route: 'oral', group: 'read' },
  { label: 'Code', route: 'coding', group: 'code' },
  { label: 'Stories', route: 'ere', group: 'stories' },
  { label: 'Community', route: 'families', group: 'community' },
  { label: 'About', route: 'about', group: 'about' }
];

const NAV_GROUPS: Record<string, string> = {
  languages: 'learn', course: 'learn', lesson: 'learn', kids: 'learn', individuals: 'learn',
  oral: 'read', oral_genre: 'read', oriki: 'read', owe: 'read', owe_add: 'read',
  owe_detail: 'read', owe_story: 'read', owe_reflection: 'read', voices: 'read',
  connect_students: 'community', connect_teachers: 'community', consent: 'community',
  coding: 'code', ere: 'stories', ere_game: 'stories', ifa: 'culture', ifa_odu: 'culture',
  about: 'about', method: 'about', families: 'community', schools: 'community', tutor: 'community',
  guides: 'culture', human: 'culture', keepers: 'culture'
};

export const Header: React.FC = () => {
  const { currentRoute, navigate, mobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useApp();
  const page = currentRoute.page;
  const currentGroup = NAV_GROUPS[page] || (page === 'index' ? 'home' : '');

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'home': return 'home';
      case 'learn': return 'book';
      case 'read': return 'headphones';
      case 'code': return 'code';
      case 'stories': return 'quote';
      case 'community': return 'people';
      default: return 'leaf';
    }
  };

  return (
    <>
      <header id="site-header" className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#/index"
            onClick={(e) => { e.preventDefault(); navigate('index'); }}
            aria-label="Idilewa home"
          >
            <span className="brand-mark" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
            <span className="brand-copy">
              <span className="brand-word">idílẹ́wà</span>
              <span className="brand-caption">Language · culture · future</span>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV.map((item) => (
              <a
                key={item.route}
                className={`nav-link ${currentGroup === item.group ? 'active' : ''}`}
                href={`#/${item.route}`}
                onClick={(e) => { e.preventDefault(); navigate(item.route); }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Search site"
            >
              <Icon name="search" size={17} />
              <span className="search-placeholder">Search</span>
              <kbd className="key-cap">⌘K</kbd>
            </button>

            <a
              className="button button-ghost header-login"
              href="#/login"
              onClick={(e) => { e.preventDefault(); navigate('login'); }}
            >
              <Icon name="user" size={16} />
              <span>Sign in</span>
            </a>

            <button
              className="icon-button mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle main menu"
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-menu-head">
          <span className="mobile-menu-title">Main Menu</span>
          <button
            className="icon-button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="mobile-menu-list">
          {NAV.map((item) => (
            <a
              key={item.route}
              className={`mobile-menu-link ${currentGroup === item.group ? 'active' : ''}`}
              href={`#/${item.route}`}
              onClick={(e) => { e.preventDefault(); navigate(item.route); }}
            >
              <Icon name={getGroupIcon(item.group)} size={18} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className="mobile-menu-bottom">
          <a
            className="button button-primary width-full"
            href="#/login"
            onClick={(e) => { e.preventDefault(); navigate('login'); }}
          >
            <Icon name="user" size={16} />
            <span>Sign in to save progress</span>
          </a>
        </div>
      </div>
    </>
  );
};
