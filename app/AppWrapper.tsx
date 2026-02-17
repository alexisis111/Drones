import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import FixedMobileTabs from './components/FixedMobileTabs';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CookieConsentBanner from '../src/components/CookieConsentBanner';
import YandexMetrika from './components/YandexMetrika';

const AppWrapper: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Мгновенная загрузка контента
    setIsLoading(false);

    return () => {};
  }, []);

  return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          {isLoading ? <LoadingScreen /> : (
              <>
                <YandexMetrika />
                <Header />
                <main className="flex-grow">
                  <Outlet />
                </main>
                <Footer />
                <FixedMobileTabs />
                <CookieConsentBanner />
              </>
          )}
        </div>
      </ThemeProvider>
  );
};

export default AppWrapper;