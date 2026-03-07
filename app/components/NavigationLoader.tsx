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

    // Скрываем лоадер сразу после загрузки
    const timer = setTimeout(() => {
      setLoading(false);
    }, 50); // Минимальная задержка для плавности

    return () => clearTimeout(timer);
  }, [location.pathname, navigationType, setLoading]);

  return null;
};

export default NavigationLoader;