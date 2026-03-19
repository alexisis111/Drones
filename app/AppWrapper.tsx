import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { HeaderProvider } from './contexts/HeaderContext';
import Header from './components/Header';
import FixedMobileTabs from './components/FixedMobileTabs';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CookieConsentBanner from '../src/components/CookieConsentBanner';
import YandexMetrika from './components/YandexMetrika';
import NavigationLoader from './components/NavigationLoader';
import ChatWidget from './components/ChatWidget';

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoading();

  return (
      <>
        <NavigationLoader />
        <YandexMetrika />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FixedMobileTabs />
        <CookieConsentBanner />
        {/* Global Chat Widget - available on all pages */}
        <ChatWidget />
      </>
  );
};

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
      <ThemeProvider>
        <LoadingProvider>
          <HeaderProvider>
            <div className="min-h-screen flex flex-col">
              <AppContent>{children}</AppContent>
            </div>
          </HeaderProvider>
        </LoadingProvider>
      </ThemeProvider>
  );
};

export default AppWrapper;