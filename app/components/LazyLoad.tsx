import React, { useState, useRef, useEffect } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  fallback?: React.ReactNode; // Component to show while loading
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  className = '',
  rootMargin = '50px',
  threshold = 0.1,
  fallback = null,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyLoad;