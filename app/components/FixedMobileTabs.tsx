import React from 'react';
import { Link, useLocation } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';

interface TabItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const FixedMobileTabs: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const tabs: TabItem[] = [
    {
      label: 'Главная',
      path: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Услуги',
      path: '/services',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Вакансии',
      path: '/vacancies',
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
      )
    },
    {
      label: 'Контакты',
      path: '/contacts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    } md:hidden`}>
      <div className="flex justify-around items-center">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center justify-center py-3 px-4 w-full ${
              location.pathname === tab.path
                ? theme === 'dark'
                  ? 'text-blue-400'
                  : 'text-blue-600'
                : theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-500'
            }`}
          >
            <div className="mb-1">{tab.icon}</div>
            <span className="text-xs">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FixedMobileTabs;