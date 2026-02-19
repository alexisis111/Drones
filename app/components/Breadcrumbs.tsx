import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import BreadcrumbListSchema, { type BreadcrumbItem } from './BreadcrumbSchema';

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs, className = '' }) => {
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
                className="text-gray-900 dark:text-white font-medium"
                aria-current="page"
              >
                {breadcrumb.name}
              </span>
            ) : (
              // Ссылка на предыдущие страницы
              <Link
                to={breadcrumb.item}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
