import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import OptimizedImage from './OptimizedImage';

interface Slide {
  imageUrl: string;
  title: string;
  description: string;
  alt: string;
  linkUrl: string;
  showNewBadge?: boolean;
}

interface ImageSliderProps {
  slides: Slide[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);

  return (
    <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <OptimizedImage
              src={slide.imageUrl}
              alt={slide.alt}
              className="w-full h-full object-cover"
              priority={index === currentIndex} // Only load the active slide eagerly
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
              <div className="text-center p-4 max-w-4xl">
                <div className="relative">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">{slide.title}</h2>
                  {slide.showNewBadge && (
                    <span className={`absolute -top-1 -right-1 transform translate-x-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold rounded-full animate animate-pulse ${
                      theme === 'dark' ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
                    }`}>
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-blue-200 max-w-md mx-auto text-lg">{slide.description}</p>
                <div className="mt-6">
                  <a
                    href={slide.linkUrl}
                    className="inline-block px-6 py-3 rounded-full font-semibold text-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    Подробнее
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full focus:outline-none transition-all ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;