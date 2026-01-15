import { useState, useEffect, useCallback } from 'react';

interface UseScrollVisibilityOptions {
  threshold?: number;
  throttleMs?: number;
}

export const useScrollVisibility = (options: UseScrollVisibilityOptions = {}) => {
  const { threshold = 100, throttleMs = 100 } = options;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > threshold) {
      // Прокрутка вниз - скрываем элемент
      setIsVisible(false);
    } else {
      // Прокрутка вверх или в верхней части страницы - показываем элемент
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY, threshold]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const throttledHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleScroll, throttleMs);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll, throttleMs]);

  return isVisible;
};