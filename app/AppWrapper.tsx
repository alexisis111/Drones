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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
      <ThemeProvider>
        <LoadingProvider>
          <HeaderProvider>
            <div className="min-h-screen flex flex-col">
              <AppContent>{children}</AppContent>
              {/* Yandex Metrika - completely client-side to avoid hydration issues */}
              {isClient && (
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      (function() {
                        if (window.ym) {
                          var sendHit = function() {
                            window.ym(106789634, 'hit', window.location.href, {
                              title: document.title,
                              referer: document.referrer
                            });
                          };
                          sendHit();
                          
                          // Listen for navigation events
                          var originalPushState = history.pushState;
                          history.pushState = function() {
                            originalPushState.apply(this, arguments);
                            sendHit();
                          };
                          
                          var originalReplaceState = history.replaceState;
                          history.replaceState = function() {
                            originalReplaceState.apply(this, arguments);
                            sendHit();
                          };
                          
                          window.addEventListener('popstate', sendHit);
                        }
                      })();
                    `
                  }}
                />
              )}
            </div>
          </HeaderProvider>
        </LoadingProvider>
      </ThemeProvider>
  );
};

export default AppWrapper;