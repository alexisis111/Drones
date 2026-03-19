import { createContext, useContext, useState, useEffect, useRef } from 'react';

interface HeaderContextType {
  headerHeight: number;
}

const HeaderContext = createContext<HeaderContextType>({ headerHeight: 80 });

export const useHeaderHeight = () => useContext(HeaderContext);

interface HeaderProviderProps {
  children: React.ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(80);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Ищем header элемент
    headerRef.current = document.querySelector('header');
    
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Обновляем при загрузке
    updateHeaderHeight();

    // Обновляем при изменении размера окна
    window.addEventListener('resize', updateHeaderHeight);
    
    // MutationObserver для отслеживания изменений в DOM
    const observer = new MutationObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current, { 
        attributes: true, 
        childList: true, 
        subtree: true 
      });
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <HeaderContext.Provider value={{ headerHeight }}>
      {children}
    </HeaderContext.Provider>
  );
};
