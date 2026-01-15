import { useEffect, useRef, useState, useCallback } from 'react';

export const useScrollDetection = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const elementRef = useRef<HTMLElement>(null);

  // Метод для прокрутки вниз с улучшенной совместимостью
  const scrollToBottom = useCallback(() => {
    const element = elementRef.current;
    if (element) {
      // Используем двойной requestAnimationFrame для гарантии, что DOM обновился
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const scrollHeight = element.scrollHeight;
          const clientHeight = element.clientHeight;
          const scrollTop = element.scrollTop;
          
          // Прокручиваем до конца, если есть новый контент
          if (scrollHeight > clientHeight) {
            element.scrollTop = scrollHeight - clientHeight;
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Очищаем предыдущий таймаут
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Устанавливаем новый таймаут для сброса состояния прокрутки
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return { isScrolling, elementRef, scrollToBottom };
};