import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { HeaderProvider } from './contexts/HeaderContext';
import Header from './components/Header';
import FixedMobileTabs from './components/FixedMobileTabs';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CookieConsentBanner from '../src/components/CookieConsentBanner';
import NavigationLoader from './components/NavigationLoader';
import ChatWidget from './components/ChatWidget';

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoading();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
      <>
        <NavigationLoader />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FixedMobileTabs />
        <CookieConsentBanner />
        {/* Global Chat Widget - only on client to avoid SSR hydration issues */}
        {isClient && <ChatWidget />}
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