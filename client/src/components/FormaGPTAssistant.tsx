import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { aiService, AIMessage } from '@/services/aiService';
import { useScrollDetection } from '@/hooks/useScrollDetection';

interface IIAssistantProps {
  className?: string;
  placeholder?: string;
  initialMessage?: string;
}

const IIAssistant: React.FC<IIAssistantProps> = ({
  className = '',
  placeholder = 'Расскажите о вашей ситуации...',
  initialMessage = '👋 Привет! Я помогу выбрать форму бизнеса. Расскажите о вашей ситуации?'
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isScrolling, elementRef, scrollToBottom } = useScrollDetection();

  // Alternative scroll to bottom using messagesEndRef
  const scrollToBottomWithRef = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Use both methods for better compatibility
    scrollToBottom();
    scrollToBottomWithRef();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputText.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
      category: 'general'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(inputText.trim(), messages);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        category: response.category || 'general'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '😔 Извините, произошла ошибка. Попробуйте переформулировать вопрос.',
        timestamp: new Date(),
        category: 'general'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Фоновый градиент */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%] bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl -z-10 rounded-full transition-opacity duration-700 opacity-40"></div>
      
      {/* Основная карточка */}
      <div className="shadcn-card shadcn-card rounded-xl bg-card text-card-foreground shadow-sm border-2 transition-all duration-300 border-primary/20">
        <div className="p-4">
          {/* Заголовок */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-4 w-4 text-white">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                <path d="M20 3v4"></path>
                <path d="M22 5h-4"></path>
                <path d="M4 17v2"></path>
                <path d="M5 18H3"></path>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm">ИИ-помощник</div>
              <div className="text-xs text-muted-foreground">AI-помощник</div>
            </div>
          </div>

          {/* Сообщения */}
          <div
            ref={(node) => {
              if (node) {
                (elementRef as any).current = node;
              }
            }}
            className={`space-y-2 mb-4 max-h-96 overflow-y-auto ai-chat-scrollbar scrolling-indicator ${isScrolling ? 'scrolling' : ''}`}
          >
            {messages.map((message) => (
              <div key={message.id} className={`rounded-lg p-3 text-sm ${message.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-muted'}`}>
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0">
                      <path d="M12 8V4H8"></path>
                      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                      <path d="M2 14h2"></path>
                      <path d="M20 14h2"></path>
                      <path d="M15 13v2"></path>
                      <path d="M9 13v2"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-4 w-4 mt-0.5 text-primary flex-shrink-0">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                  <div className="flex-1">{message.content}</div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="rounded-lg p-3 text-sm bg-muted">
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0 animate-spin">
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2"></path>
                    <path d="M20 14h2"></path>
                    <path d="M15 13v2"></path>
                    <path d="M9 13v2"></path>
                  </svg>
                  <div className="flex-1 text-muted-foreground">ИИ-помощник думает...</div>
                </div>
              </div>
            )}
            
            {/* Invisible element for scrollIntoView reference */}
            <div ref={messagesEndRef} />
          </div>

          {/* Форма ввода */}
          <form className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputText.trim()}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border h-9 w-9 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send h-4 w-4">
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                <path d="m21.854 2.147-10.94 10.939"></path>
              </svg>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IIAssistant;