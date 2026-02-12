import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import OptimizedImage from './OptimizedImage';

interface DroneImageSectionProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  altText: string;
  linkUrl?: string;
}

const DroneImageSection: React.FC<DroneImageSectionProps> = ({
  title,
  subtitle,
  imageUrl,
  altText,
  linkUrl
}) => {
  const { theme } = useTheme();

  const ImageContent = (
    <div className={`
      rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.02]
      ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
    `}>
      <div className="relative">
        <div className={`
          aspect-video bg-cover bg-center flex items-center justify-center
          ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
        `}>
          <OptimizedImage
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-cover"
            width={800} // Assuming a standard width for these images
            height={450} // Assuming a 16:9 aspect ratio
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-blue-200">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return linkUrl ? (
    <div>
      {ImageContent}
    </div>
  ) : (
    ImageContent
  );
};

export default DroneImageSection;