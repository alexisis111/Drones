import React, { useEffect } from 'react';
import { useNavigationType, useLocation } from 'react-router';
import { useLoading } from '../contexts/LoadingContext';

const NavigationLoader: React.FC = () => {
  const navigationType = useNavigationType();
  const location = useLocation();
  const { setLoading } = useLoading();

  useEffect(() => {
    // Показываем лоадер при навигации
    setLoading(true);

    // Скрываем лоадер через короткую задержку
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Небольшая задержка для плавности

    return () => clearTimeout(timer);
  }, [location.pathname, navigationType, setLoading]);

  return null;
};

export default NavigationLoader;