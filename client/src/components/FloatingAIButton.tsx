import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

const FloatingAIButton: React.FC = () => {
  const { toggleMinimized, isVisible } = useAIAssistant();
  const isScrollVisible = useScrollVisibility({ threshold: 100, throttleMs: 100 });
  
  // Определяем CSS классы на основе состояния
  const buttonClasses = useMemo(() => {
    const baseClasses = 'fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-xl hover-elevate active-elevate-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 floating-ai-button';
    
    // Кнопка всегда видима, но добавляем класс при прокрутке
    if (isScrollVisible) {
      return `${baseClasses} scroll-visible`;
    } else {
      return `${baseClasses} scroll-hidden`;
    }
  }, [isScrollVisible]);
  
  // Если кнопка не должна быть видима, не рендерим её
  if (!isVisible) return null;
  
  return (
    <button
      onClick={toggleMinimized}
      className={buttonClasses}
      // Убираем opacity и transform - кнопка всегда видима
      data-testid="floating-ai-button"
      aria-label="Открыть ИИ-ассистента"
    >
      {/* Иконка искр */}
      <Sparkles className="h-6 w-6 relative z-10" />
      
      {/* Пульсирующий индикатор онлайн-статуса */}
      <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
      
      {/* Дополнительный пульсирующий эффект для привлечения внимания */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600 animate-ping opacity-20" />
      
      {/* Эффект свечения при наведении */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-0 hover:opacity-20 transition-opacity duration-300" />
    </button>
  );
};

export default React.memo(FloatingAIButton);