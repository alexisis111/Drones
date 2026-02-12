import { useEffect } from 'react';
import { useLocation } from 'react-router';

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: any[]) => void;
  }
}

const YandexMetrika = () => {
  const location = useLocation();

  useEffect(() => {
    // Проверяем, что ym функция доступна и мы на клиенте
    if (typeof window !== 'undefined' && window.ym) {
      // Отправляем hit при каждом изменении маршрута
      window.ym(106789634, 'hit', location.pathname, {
        title: document.title,
        referer: document.referrer,
      });
      
      // Логируем успешный вызов для отладки
      console.log('Yandex Metrika hit sent for:', location.pathname);
    } else {
      // Логируем, если функция ym недоступна
      console.log('Yandex Metrika function not available');
    }
    
    // Также отправляем hit при первой загрузке компонента
    if (typeof window !== 'undefined' && window.ym) {
      // Небольшая задержка для уверенности, что инициализация завершена
      const timer = setTimeout(() => {
        window.ym(106789634, 'hit', location.pathname, {
          title: document.title,
          referer: document.referrer,
        });
        
        console.log('Yandex Metrika initial hit sent for:', location.pathname);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  return null;
};

export default YandexMetrika;