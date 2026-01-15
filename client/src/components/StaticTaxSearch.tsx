import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { Search, ArrowRight, Sparkles, CornerDownLeft, Loader2, Trash2, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useScrollDetection } from '@/hooks/useScrollDetection';

interface StaticTaxSearchProps {
  className?: string;
  onMessage?: (message: string) => void;
  placeholder?: string;
}

const StaticTaxSearch = memo(({
  className,
  onMessage,
  placeholder = "Задайте вопрос по налогам или праву..."
}: StaticTaxSearchProps) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string, text: string }>>([]);
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
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: messages.slice(-6),
          category: 'general'
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.message }]);
      onMessage?.(data.message);
    } catch (error) {
      console.error('Search error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Ошибка сети. Попробуйте позже.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTag = useCallback((tag: string) => {
    setQuery(tag);
    // Небольшой хак, чтобы фокус вернулся в инпут
    document.getElementById('tax-search-input')?.focus();
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setQuery('');
  }, []);

  // Форматирование текста (базовое)
  const renderText = useCallback((text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={`mb-2 last:mb-0 ${line.startsWith('•') ? 'pl-4' : ''}`}>
        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
      </p>
    ));
  }, []);

  // Быстрые теги
  const quickTags = useMemo(() => [
    { text: "Как открыть ИП в 2026?", icon: Briefcase },
    { text: "Налог НПД ставки", icon: FileText },
    { text: "Нужна ли касса для ООО?", icon: Search }
  ], []);

  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 font-sans relative z-10", className)}>

      {/* Фоновое свечение (Ambient Glow) */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%] bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-3xl -z-10 rounded-full transition-opacity duration-700",
        isFocused || messages.length > 0 ? "opacity-100" : "opacity-40"
      )} />

      {/* Основной контейнер */}
      <Card className={cn(
        "bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 ease-in-out",
        messages.length > 0 ? "min-h-[400px]" : "min-h-[auto]"
      )}>

        {/* Верхняя панель с инпутом */}
        <CardContent className="p-2">
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              </div>

              <Input
                id="tax-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={messages.length > 0 ? "Задайте уточняющий вопрос..." : placeholder}
                className={cn(
                  "w-full bg-muted/50 hover:bg-muted focus:bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl pl-12 pr-4 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 transition-all duration-300 shadow-inner"
                )}
                autoComplete="off"
              />
            </div>

            <Button
              type="submit"
              disabled={!query.trim() || isLoading}
              className={cn(
                "p-3 rounded-xl transition-all duration-200 flex items-center justify-center h-12 w-12 flex-shrink-0",
                query.trim()
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transform hover:scale-105"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {messages.length > 0 ? <CornerDownLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>
        </CardContent>

        {/* Область ответов (появляется, если есть сообщения) */}
        <div
          ref={(node) => {
            if (node) {
              (chatContainerRef as any).current = node;
              (elementRef as any).current = node;
            }
          }}
          className={cn(
            "transition-all duration-500 ease-in-out overflow-y-auto px-6 ai-chat-scrollbar scrolling-indicator",
            isScrolling ? "scrolling" : "",
            messages.length > 0 ? "max-h-[400px] py-4 border-t border-border" : "max-h-0 py-0 opacity-0"
          )}
        >
          {messages.map((msg, index) => (
            <div key={index} className={cn("mb-6 last:mb-0 animate-in slide-in-from-bottom-2 fade-in duration-300", msg.role === 'user' ? "text-right" : "text-left")}>
              {msg.role === 'model' ? (
                <Card className="inline-block max-w-[95%] rounded-2xl rounded-tl-sm">
                  <CardContent className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ИИ помощник</span>
                    </div>
                    <div className="text-sm leading-relaxed prose prose-slate" dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                        .replace(/- (.*?)(<br\/>|$)/g, '• $1$2')
                    }} />
                  </CardContent>
                </Card>
              ) : (
                <div className="inline-block bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm shadow-md text-sm font-medium">
                  {msg.text}
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
        </div>

        {/* Подсказки (исчезают, если чат активен) */}
        <div className={cn(
          "px-6 pb-4 bg-muted/30 flex items-center justify-between transition-all duration-500",
          messages.length > 0 ? "h-12 opacity-100 border-t border-border" : "h-auto pt-2 opacity-100"
        )}>
          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-start">
              {quickTags.map((tag, idx) => {
                const Icon = tag.icon;
                return (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTag(tag.text)}
                    className="gap-1.5 text-xs font-medium hover:border-primary hover:text-primary hover-elevate"
                  >
                    <Icon className="w-3 h-3" />
                    {tag.text.includes('ИП') ? 'Открыть ИП' : tag.text.includes('НПД') ? 'Ставки НПД' : 'Касса для ООО'}
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="flex w-full justify-between items-center">
              <span className="text-xs text-muted-foreground">Диалог активен</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetChat}
                className="flex items-center gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 px-2 py-1 rounded"
              >
                <Trash2 className="w-3 h-3" /> Очистить
              </Button>
            </div>
          )}
        </div>
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
});

StaticTaxSearch.displayName = "StaticTaxSearch";

export default StaticTaxSearch;