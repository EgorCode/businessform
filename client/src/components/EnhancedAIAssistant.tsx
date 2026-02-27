import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Send, Upload, X, Loader2, FileText, Calculator, Users, TrendingUp, HelpCircle, ClipboardCheck } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import { useAIChat } from "@/hooks/useAIChat";
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pricing, PricingPlan } from "@/components/blocks/pricing";
import { SubscriptionDialog } from "@/components/shared/SubscriptionDialog";



// Предустановленные быстрые вопросы для категорий
const quickQuestions = {
  general: [
    "Какую форму бизнеса выбрать для начала?",
    "Что нужно для регистрации бизнеса?",
    "Сколько времени занимает регистрация?"
  ],
  "business-form": [
    "ИП или ООО - что лучше для моего случая?",
    "Когда нужно переходить с самозанятости на ИП?",
    "Какие налоги для ИП на УСН 6%?"
  ],
  taxes: [
    "Как рассчитать налоги для ИП?",
    "Что такое НПД и кому подходит?",
    "Какие вычеты доступны для ИП?"
  ],
  documents: [
    "Какие документы нужны для регистрации ИП?",
    "Как составить договор с клиентом?",
    "Как вести бухгалтерию для малого бизнеса?"
  ],
  registration: [
    "Как зарегистрировать ИП онлайн?",
    "Сколько стоит регистрация ООО?",
    "Какие шаги для открытия расчётного счёта?"
  ]
};

interface EnhancedAIAssistantProps {
  isMinimized?: boolean;
  onToggle?: () => void;
}

export default function EnhancedAIAssistant({ isMinimized = false, onToggle }: EnhancedAIAssistantProps) {
  const { messages, toggleMinimized } = useAIAssistant();
  const { input, setInput, isThinking, handleSend, handleQuickQuestion } = useAIChat();
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isScrolling, elementRef, scrollToBottom } = useScrollDetection();
  const [isPricingOpen, setIsPricingOpen] = useState(false);



  // Используем глобальный toggleMinimized если onToggle не передан
  const handleToggle = useCallback(() => {
    if (onToggle) {
      onToggle();
    } else {
      toggleMinimized();
    }
  }, [onToggle, toggleMinimized]);

  // Альтернативный метод прокрутки через scrollIntoView
  const scrollToBottomWithRef = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  // Автопрокрутка при новом сообщении
  useEffect(() => {
    // Используем небольшую задержку, чтобы DOM успел обновиться
    const timeoutId = setTimeout(() => {
      scrollToBottom();
      scrollToBottomWithRef();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom, scrollToBottomWithRef]);

  // Удалены handleSend, handleQuickQuestion, handleFileUpload, так как они перенесены / не нужны

  // Компонент больше не рендерит минимизированную кнопку
  // Это теперь обрабатывается FloatingAIButton
  if (isMinimized) {
    return null;
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[450px] max-w-[90vw] h-[600px] max-h-[80vh] shadow-2xl backdrop-blur-md bg-card/95 flex flex-col overflow-hidden" style={{ height: '600px', maxHeight: '80vh' }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">ИИ-помощник</CardTitle>
            <CardDescription className="text-xs">AI-помощник по бизнесу</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Онлайн
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleToggle}
            data-testid="button-close-enhanced-chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col" style={{ height: '100%', minHeight: '0' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col overflow-hidden" style={{ height: '100%', minHeight: '0' }}>
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2">

              <TabsTrigger value="chat" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Чат
              </TabsTrigger>
              <TabsTrigger value="tools" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Ещё
              </TabsTrigger>
            </TabsList>
          </div>



          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-4 p-0 space-y-0" style={{ height: '100%', minHeight: '0' }}>
            {/* Область сообщений с прокруткой */}
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
              className={cn(
                "flex-1 pr-4 px-4 ai-chat-scrollbar scrolling-indicator",
                isScrolling ? 'scrolling' : '',
                messages.length > 0 ? 'py-4 border-t border-border' : 'py-0'
              )}
              data-testid="scroll-enhanced-messages"
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "mb-6 last:mb-0 animate-in slide-in-from-bottom-2 fade-in duration-300",
                      message.role === "user" ? "text-right" : "text-left"
                    )}
                    data-testid={`message-${message.role}-${message.id}`}
                  >
                    {message.role === "assistant" ? (
                      <Card className="inline-block max-w-[85%] rounded-2xl rounded-tl-sm">
                        <CardContent className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ИИ помощник</span>
                            {message.category && (
                              <Badge variant="secondary" className="text-xs ml-1">
                                {message.category === "general" && "Общее"}
                                {message.category === "business-form" && "Форма бизнеса"}
                                {message.category === "taxes" && "Налоги"}
                                {message.category === "documents" && "Документы"}
                                {message.category === "registration" && "Регистрация"}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap prose prose-slate">
                            {message.content}
                          </div>
                          <div className="mt-2 text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="inline-block max-w-[85%] bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm shadow-md text-sm font-medium">
                        {message.content}
                        <div className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isThinking && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-4 animate-pulse pl-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2">Формирую ответ...</span>
                  </div>
                )}
                {/* Невидимый элемент для scrollIntoView */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Поле ввода - всегда видимо внизу */}
            <div className="px-4 pb-4 pt-2 border-t border-border space-y-2 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Расскажите о вашем бизнесе..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  data-testid="input-enhanced-chat-message"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isThinking}
                  data-testid="button-send-enhanced-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Быстрые вопросы */}
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Быстрые вопросы:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickQuestions.general.slice(0, 3).map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4 px-4 pb-4" style={{ height: '100%', overflow: 'auto', minHeight: '0' }}>
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start gap-3 h-auto p-3"
                onClick={() => window.location.href = '/wizard'}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Calculator className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Мастер выбора формы</div>
                  <div className="text-xs text-muted-foreground">Подберёт оптимальную структуру</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-auto p-3"
                onClick={() => window.location.href = '/calculators'}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Калькуляторы налогов</div>
                  <div className="text-xs text-muted-foreground">Точные расчёты для вашей ситуации</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-auto p-3"
                onClick={() => window.location.href = '/documents'}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Документы для регистрации</div>
                  <div className="text-xs text-muted-foreground">Готовые шаблоны и инструкции</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-auto p-3"
                onClick={() => setIsPricingOpen(true)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <Upload className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Загрузить документы</div>
                  <div className="text-xs text-muted-foreground">Анализ договоров и выписок</div>
                </div>
              </Button>

              <SubscriptionDialog open={isPricingOpen} onOpenChange={setIsPricingOpen} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}