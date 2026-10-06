import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { RouteType } from '../../types';

interface MobileNavItem {
  route: RouteType;
  label: string;
  ico: string;
}

export const MobileNav: React.FC = () => {
  const { currentRoute, navigate } = useApp();
  const page = currentRoute.page;

  const items: MobileNavItem[] = [
    { route: 'index', label: 'Home', ico: 'home' },
    { route: 'languages', label: 'Learn', ico: 'book' },
    { route: 'ere', label: 'Stories', ico: 'quote' },
    { route: 'coding', label: 'Code', ico: 'code' },
    { route: 'profile', label: 'Progress', ico: 'user' }
  ];

  return (
    <nav className="mobile-nav" aria-label="Mobile bottom navigation">
      {items.map((item) => {
        const isActive = page === item.route || (item.route === 'languages' && ['course', 'lesson'].includes(page));
        return (
          <a
            key={item.route}
            href={`#/${item.route}`}
            onClick={(e) => { e.preventDefault(); navigate(item.route); }}
            className={`mobile-tab ${isActive ? 'active' : ''}`}
          >
            <Icon name={item.ico} size={18} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};
