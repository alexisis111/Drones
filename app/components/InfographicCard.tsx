import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface InfographicCardProps {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: boolean;
}

const InfographicCard: React.FC<InfographicCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  gradient = false
}) => {
  const { theme } = useTheme();

  return (
    <div className={`
      rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl
      ${gradient 
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
        : theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }
    `}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold mb-1 ${
            gradient || theme === 'dark' ? 'text-white' : 'text-gray-700'
          }`}>
            {title}
          </h3>
          <div className={`text-3xl font-bold mb-2 ${
            gradient || theme === 'dark' ? 'text-white' : 'text-blue-600'
          }`}>
            {value}
          </div>
          <p className={`
            text-sm ${gradient || theme === 'dark' ? 'text-blue-100' : 'text-gray-600'}
          `}>
            {description}
          </p>
        </div>
        {icon && (
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            ${gradient 
              ? 'bg-white/20' 
              : theme === 'dark' 
                ? 'bg-blue-900/30 text-blue-400' 
                : 'bg-blue-100 text-blue-600'
            }
          `}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfographicCard;