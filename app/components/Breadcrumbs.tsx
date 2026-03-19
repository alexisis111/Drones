import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import BreadcrumbListSchema, { type BreadcrumbItem } from './BreadcrumbSchema';
import {useTheme} from "~/contexts/ThemeContext";

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs, className = '' }) => {
    const { theme } = useTheme();
    
    // Определяем цвет текста: если передан className, используем его, иначе определяем по теме
    const textColor = className || (theme === 'dark' ? 'text-white/80' : 'text-black');
    
  return (
    <>
      {/* Schema.org разметка */}
      <BreadcrumbListSchema breadcrumbs={breadcrumbs} />

      {/* Визуальное отображение */}
      <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Хлебные крошки">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.position}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            )}

            {index === breadcrumbs.length - 1 ? (
              // Текущая страница (не кликабельная)
              <span
                className={textColor}
                aria-current="page"
              >
                {breadcrumb.name}
              </span>
            ) : (
              // Ссылка на предыдущие страницы
              <Link
                to={breadcrumb.item}
                className={textColor}
              >
                {breadcrumb.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumbs;
