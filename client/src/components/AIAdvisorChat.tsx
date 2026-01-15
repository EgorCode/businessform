import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Upload, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useScrollDetection } from '@/hooks/useScrollDetection';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// todo: remove mock functionality
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Привет! Я ИИ-помощник в выборе формы бизнеса. Расскажите о вашем проекте или загрузите документы (договоры, выписки), и я помогу подобрать оптимальную структуру.",
    timestamp: new Date(),
  },
];

interface AIAdvisorChatProps {
  isMinimized?: boolean;
  onToggle?: () => void;
}

export default function AIAdvisorChat({ isMinimized = false, onToggle }: AIAdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isScrolling, elementRef, scrollToBottom } = useScrollDetection();

  // Alternative scroll to bottom using messagesEndRef
  const scrollToBottomWithRef = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    // Use both methods for better compatibility
    scrollToBottom();
    scrollToBottomWithRef();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Анализирую вашу ситуацию: "${input}"\n\nНа основе этого я рекомендую рассмотреть следующие варианты:\n\n1. **ИП на УСН 6%** — если планируете доход до 200М ₽/год\n2. **ООО** — если будете работать с партнёрами или крупными клиентами\n\nХотите, чтобы я рассчитал точную налоговую нагрузку?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
      console.log('AI response generated for:', input);
    }, 1500);
  };

  const handleFileUpload = () => {
    console.log('File upload triggered');
    // Simulate file upload
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Отлично! Загрузите документы (PDF, JPG, PNG), и я проанализирую:\n• Договоры с клиентами\n• Банковские выписки\n• Чеки и накладные\n\nЭто поможет мне точнее рассчитать доходы и расходы для рекомендации.",
      timestamp: new Date(),
    };
    setMessages([...messages, aiMessage]);
  };

  if (isMinimized) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl hover-elevate active-elevate-2 transition-all"
        data-testid="button-ai-chat-minimize"
      >
        <Sparkles className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[420px] shadow-2xl backdrop-blur-md bg-card/95">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">ИИ-помощник</CardTitle>
            <CardDescription className="text-xs">AI-помощник по выбору формы</CardDescription>
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
            onClick={onToggle}
            data-testid="button-close-chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
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
          className={`h-[400px] pr-4 ai-chat-scrollbar scrolling-indicator ${isScrolling ? 'scrolling' : ''}`}
          data-testid="scroll-messages"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.role}-${message.id}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-primary">AI</span>
                    </div>
                  )}
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
            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">ИИ-помощник думает...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Invisible element for scrollIntoView reference */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Опишите ваш бизнес..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              data-testid="input-chat-message"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleFileUpload}
            data-testid="button-upload-document"
          >
            <Upload className="h-4 w-4" />
            Загрузить документы для анализа
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
