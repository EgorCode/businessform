import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AIMessage } from '@/services/aiService';

interface AIAssistantContextType {
  isMinimized: boolean;
  isVisible: boolean;
  messages: AIMessage[];
  subscriptionTier: "none" | "lite" | "max";
  toggleMinimized: () => void;
  setVisibility: (visible: boolean) => void;
  addMessage: (message: AIMessage) => void;
  clearMessages: () => void;
  setMessages: (messages: AIMessage[]) => void;
  setSubscriptionTier: (tier: "none" | "lite" | "max") => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

interface AIAssistantProviderProps {
  children: ReactNode;
}

export function AIAssistantProvider({ children }: AIAssistantProviderProps) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<"none" | "lite" | "max">("none");
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Привет! Я ИИ-помощник — ваш AI-помощник по бизнесу в России.\n\nЯ могу помочь вам:\n• Выбрать оптимальную форму бизнеса (ИП, ООО, самозанятость)\n• Рассчитать налоги и взносы\n• Подготовить документы для регистрации\n• Ответить на вопросы о ведении бизнеса\n\nРасскажите о вашей ситуации или выберите быстрый вопрос ниже!",
      timestamp: new Date(),
      category: "general"
    },
  ]);

  const toggleMinimized = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const setVisibility = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  const addMessage = useCallback((message: AIMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: "👋 Привет! Я ИИ-помощник — ваш AI-помощник по бизнесу в России.\n\nЯ могу помочь вам:\n• Выбрать оптимальную форму бизнеса (ИП, ООО, самозанятость)\n• Рассчитать налоги и взносы\n• Подготовить документы для регистрации\n• Ответить на вопросы о ведении бизнеса\n\nРасскажите о вашей ситуации или выберите быстрый вопрос ниже!",
      timestamp: new Date(),
      category: "general"
    }]);
  }, []);

  const value = {
    isMinimized,
    isVisible,
    messages,
    subscriptionTier,
    toggleMinimized,
    setVisibility,
    addMessage,
    clearMessages,
    setMessages,
    setSubscriptionTier
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}