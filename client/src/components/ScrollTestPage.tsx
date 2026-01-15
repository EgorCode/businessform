import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { Sparkles, Send, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ScrollTestPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Это тестовая страница для проверки скроллбаров и автоскроллинга. Попробуйте добавить несколько сообщений!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isScrolling, elementRef, scrollToBottom } = useScrollDetection();

  // Альтернативный метод скролла
  const scrollToBottomWithRef = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Автопрокрутка при изменении сообщений
  React.useEffect(() => {
    scrollToBottom();
    scrollToBottomWithRef();
  }, [messages, scrollToBottom]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Симуляция ответа ИИ
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Это ответ ИИ на ваше сообщение: "${input}". Новые сообщения должны автоматически прокручиваться вниз, а скроллбар должен быть скрыт по умолчанию и появляться только при наведении или прокрутке.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleClearMessages = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Чат очищен! Скроллбар должен быть скрыт по умолчанию и появляться только при наведении или прокрутке.',
        timestamp: new Date(),
      },
    ]);
  };

  const handleAddMultipleMessages = () => {
    const newMessages: Message[] = [];
    for (let i = 1; i <= 5; i++) {
      newMessages.push({
        id: (Date.now() + i).toString(),
        role: i % 2 === 0 ? 'assistant' : 'user',
        content: `Тестовое сообщение #${i}. Это сообщение для проверки автоскроллинга и поведения скроллбара.`,
        timestamp: new Date(),
      });
    }
    setMessages(prev => [...prev, ...newMessages]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Тест скроллбаров и автоскроллинга
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4">
          <ScrollArea
            ref={(node) => {
              if (node) {
                // Получаем прокручиваемый элемент внутри ScrollArea
                const viewport = node.querySelector('[data-radix-scroll-area-viewport]');
                if (viewport) {
                  (elementRef as any).current = viewport;
                }
              }
            }}
            className={`flex-1 pr-4 ai-chat-scrollbar scrolling-indicator ${isScrolling ? 'scrolling' : ''}`}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {/* Невидимый элемент для scrollIntoView */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Введите сообщение для теста..."
                className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
              />
              <Button onClick={handleSendMessage} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAddMultipleMessages}>
                Добавить 5 сообщений
              </Button>
              <Button variant="outline" onClick={handleClearMessages}>
                <Trash2 className="h-4 w-4 mr-2" />
                Очистить чат
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>• Скроллбар должен быть скрыт по умолчанию</p>
              <p>• Скроллбар должен появляться при наведении или прокрутке</p>
              <p>• Новые сообщения должны автоматически прокручиваться вниз</p>
              <p>• Статус прокрутки: {isScrolling ? 'активна' : 'неактивна'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrollTestPage;