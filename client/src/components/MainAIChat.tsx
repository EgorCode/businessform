import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Sparkles, CornerDownLeft, Loader2, Trash2, FileText, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiService } from "@/services/aiService";
import { useScrollDetection } from '@/hooks/useScrollDetection';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: "general" | "business-form" | "taxes" | "documents" | "registration";
}

const MainAIChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isScrolling, elementRef, scrollToBottom } = useScrollDetection();

  // Автопрокрутка при новом сообщении
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query;
    setQuery(''); // Очищаем поле ввода

    // Добавляем сообщение пользователя в интерфейс
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Используем наш AI сервис вместо прямого вызова API
      const response = await aiService.sendMessage(userText, newMessages);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        category: response.category
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI Service Error:', error);

      // Fallback ответ при ошибке
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Извините, произошла ошибка. Пожалуйста, попробуйте переформулировать вопрос или обратитесь в поддержку.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTag = (tag: string) => {
    setQuery(tag);
    // Небольшой хак, чтобы фокус вернулся в инпут
    document.getElementById('main-ai-chat-input')?.focus();
  };

  const resetChat = () => {
    setMessages([]);
    setQuery('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 font-sans relative z-10">

      {/* Фоновое свечение (Ambient Glow) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%] bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl -z-10 rounded-full transition-opacity duration-700 ${isFocused || messages.length > 0 ? 'opacity-100' : 'opacity-40'}`}></div>

      {/* Основной контейнер */}
      <Card className={`
        bg-card/80 backdrop-blur-xl border border-border shadow-2xl 
        rounded-3xl overflow-hidden transition-all duration-500 ease-in-out
        ${messages.length > 0 ? 'min-h-[400px]' : 'min-h-[auto]'}
      `}>

        {/* Верхняя панель с заголовком и инпутом */}
        <CardHeader className="pb-2">
          {/* Заголовок с иконкой ИИ-помощника */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">ИИ-помощник</div>
              <div className="text-xs text-muted-foreground">AI-помощник</div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              </div>

              <Input
                id="main-ai-chat-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={messages.length > 0 ? "Задайте уточняющий вопрос..." : "Задайте вопрос по налогам или праву..."}
                className="w-full bg-muted/50 hover:bg-muted focus:bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-4 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 transition-all duration-300 shadow-inner"
                autoComplete="off"
              />
            </div>

            <Button
              type="submit"
              disabled={!query.trim() || isLoading}
              className={`
                p-3 rounded-xl transition-all duration-200 flex items-center justify-center h-12 w-12 flex-shrink-0
                ${query.trim()
                  ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transform hover:scale-105'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'}
              `}
            >
              {messages.length > 0 ? <CornerDownLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>
        </CardHeader>

        {/* Область ответов (появляется, если есть сообщения) */}
        <CardContent className="p-0">
          <ScrollArea
            ref={(node) => {
              if (node) {
                // Get the scrollable viewport element inside ScrollArea
                const viewport = node.querySelector('[data-radix-scroll-area-viewport]');
                if (viewport) {
                  (elementRef as any).current = viewport;
                }
              }
            }}
            className={`
              transition-all duration-500 ease-in-out overflow-y-auto px-6 ai-chat-scrollbar scrolling-indicator
              ${isScrolling ? 'scrolling' : ''}
              ${messages.length > 0 ? 'max-h-[400px] py-4 border-t border-border' : 'max-h-0 py-0 opacity-0'}
            `}
          >
            {messages.map((msg, index) => (
              <div key={index} className={`mb-6 last:mb-0 animate-in slide-in-from-bottom-2 fade-in duration-300 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'assistant' ? (
                  <Card className="inline-block bg-muted border border-border rounded-2xl rounded-tl-sm px-6 py-4 text-foreground leading-relaxed shadow-sm max-w-[95%]">
                    {/* Иконка бота внутри сообщения */}
                    <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ИИ помощник</span>
                    </div>
                    <div className="prose prose-sm text-foreground" dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                        .replace(/- (.*?)(<br\/>|$)/g, '• $1$2')
                    }} />
                  </Card>
                ) : (
                  <div className="inline-block bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm shadow-md text-sm font-medium">
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-4 animate-pulse pl-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-2">Формирую ответ...</span>
              </div>
            )}
          </ScrollArea>

          {/* Подсказки (исчезают, если чат активен) */}
          <div className={`
             px-6 pb-4 bg-muted/30 flex items-center justify-between transition-all duration-500
             ${messages.length > 0 ? 'h-12 opacity-100 border-t border-border' : 'h-auto pt-2 opacity-100'}
          `}>
            {messages.length === 0 ? (
              <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTag("Как открыть ИП в 2026?")}
                  className="flex items-center gap-1.5 text-xs font-medium"
                >
                  <Briefcase className="w-3 h-3" /> Открыть ИП
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTag("Налог НПД ставки")}
                  className="flex items-center gap-1.5 text-xs font-medium"
                >
                  <FileText className="w-3 h-3" /> Ставки НПД
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTag("Нужна ли касса для ООО?")}
                  className="flex items-center gap-1.5 text-xs font-medium"
                >
                  <Search className="w-3 h-3" /> Касса для ООО
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-between items-center">
                <Badge variant="secondary" className="text-xs">
                  Диалог активен
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetChat}
                  className="flex items-center gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" /> Очистить
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Декоративный текст под блоком (только если чат закрыт) */}
      {messages.length === 0 && (
        <div className="text-center mt-4 animate-in fade-in slide-in-from-top-2 duration-700 delay-100">
          <p className="text-muted-foreground text-sm font-medium">
            Используем <span className="text-primary">ИИ помощник</span> для анализа НК РФ
          </p>
        </div>
      )}
    </div>
  );
};

export default MainAIChat;