import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import Header from './components/Header';
import FixedMobileTabs from './components/FixedMobileTabs';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CookieConsentBanner from '../src/components/CookieConsentBanner';
import YandexMetrika from './components/YandexMetrika';
import NavigationLoader from './components/NavigationLoader';

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoading();

  return (
      <>
        {isLoading && (
            <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-900">
              <LoadingScreen />
            </div>
        )}
        <NavigationLoader />
        <YandexMetrika />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FixedMobileTabs />
        <CookieConsentBanner />
      </>
  );
};

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
      <ThemeProvider>
        <LoadingProvider>
          <div className="min-h-screen flex flex-col">
            <AppContent>{children}</AppContent>
          </div>
        </LoadingProvider>
      </ThemeProvider>
  );
};

export default AppWrapper;