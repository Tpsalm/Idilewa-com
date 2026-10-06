import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { ModalRoot, ToastRoot } from './components/common/ModalsAndToasts';
import { SearchModal } from './components/common/SearchModal';
import { AiHelperDrawer } from './components/common/AiHelperDrawer';

import { HomeView } from './components/views/HomeView';
import { LanguagesView } from './components/views/LanguagesView';
import { CourseView } from './components/views/CourseView';
import { LessonView } from './components/views/LessonView';
import { CodingView } from './components/views/CodingView';
import {
  OralView,
  OrikiView,
  EreView,
  EreGameView
} from './components/views/OralAndProverbViews';
import {
  OweView,
  OweDetailView,
  OweStoryView,
  OweReflectionView,
  OweAddView
} from './components/views/ProverbDetailViews';
import {
  ConnectTeachersView,
  ConsentView,
  VoicesView,
  PricingView,
  ProfileView,
  LoginView,
  GenericPageView
} from './components/views/CommunityAndOtherViews';

export const AppContent: React.FC = () => {
  const { currentRoute } = useApp();
  const page = currentRoute.page;

  const renderView = () => {
    switch (page) {
      case 'index':
        return <HomeView />;
      case 'languages':
        return <LanguagesView />;
      case 'course':
        return <CourseView />;
      case 'lesson':
        return <LessonView />;
      case 'coding':
        return <CodingView />;
      case 'oral':
      case 'oral_genre':
        return <OralView />;
      case 'oriki':
        return <OrikiView />;
      case 'ere':
        return <EreView />;
      case 'ere_game':
        return <EreGameView />;
      case 'owe':
        return <OweView />;
      case 'owe_detail':
        return <OweDetailView />;
      case 'owe_story':
        return <OweStoryView />;
      case 'owe_reflection':
        return <OweReflectionView />;
      case 'owe_add':
        return <OweAddView />;
      case 'connect_teachers':
      case 'connect_students':
        return <ConnectTeachersView />;
      case 'consent':
        return <ConsentView />;
      case 'voices':
        return <VoicesView />;
      case 'pricing':
        return <PricingView />;
      case 'profile':
        return <ProfileView />;
      case 'login':
        return <LoginView />;
      default:
        return <GenericPageView pageKey={page} />;
    }
  };

  return (
    <div id="app" className="app-shell">
      <Header />
      <main id="main" className="main">
        {renderView()}
      </main>
      <Footer />
      <MobileNav />
      <ModalRoot />
      <ToastRoot />
      <SearchModal />
      <AiHelperDrawer />
    </div>
  );
};
