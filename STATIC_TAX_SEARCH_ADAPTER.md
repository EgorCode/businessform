# Адаптация компонента StaticTaxSearch под BizStartMaster

## Исходный анализ
Предоставленный компонент StaticTaxSearch имеет современный дизайн с glassmorphism эффектами, но использует кастомные стили вместо Tailwind CSS и не интегрирован с дизайн-системой BizStartMaster.

## Требования к адаптации

### 1. Соответствие дизайн-системе BizStartMaster
- Использование CSS переменных проекта (`--primary`, `--secondary`, `--muted`)
- Применение системы elevate эффектов
- Использование шрифтов Inter и JetBrains Mono
- Адаптация под светлую/темную тему
- Соответствие border radius и shadow системе

### 2. Интеграция с UI компонентами
- Замена кастомных элементов на компоненты из `@/components/ui/`
- Использование `Button`, `Input`, `Badge` компонентов
- Применение утилиты `cn()` для объединения классов
- Сохранение функциональности оригинального компонента

### 3. Оптимизация для React/Vite
- Правильное использование React hooks
- Оптимизация рендеринга
- Правильная работа с TypeScript
- Интеграция с существующей архитектурой

## Детальная адаптация

### Структура компонента
```typescript
interface StaticTaxSearchProps {
  className?: string;
  onMessage?: (message: string) => void;
  placeholder?: string;
}

const StaticTaxSearch: React.FC<StaticTaxSearchProps> = ({
  className,
  onMessage,
  placeholder = "Задайте вопрос по налогам или праву..."
}) => {
  // Component logic
};
```

### Замена стилей

#### Фоновое свечение
**Оригинал:**
```css
bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl
```

**Адаптация:**
```tsx
<div className={cn(
  "absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 blur-3xl -z-10 rounded-full",
  "transition-opacity duration-700",
  isFocused || messages.length > 0 ? "opacity-100" : "opacity-40"
)} />
```

#### Основной контейнер
**Оригинал:**
```css
bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl
```

**Адаптация:**
```tsx
<div className={cn(
  "bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden",
  "transition-all duration-500 ease-in-out",
  messages.length > 0 ? "min-h-[400px]" : "min-h-[auto]",
  className
)}>
```

#### Поле ввода
**Оригинал:**
```css
bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-2 border-transparent focus:border-blue-500/20
```

**Адаптация:**
```tsx
<Input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  placeholder={placeholder}
  className={cn(
    "bg-muted/50 hover:bg-muted focus:bg-background",
    "border-2 border-transparent focus:border-primary/20",
    "transition-all duration-300 shadow-inner",
    "h-12 text-lg"
  )}
/>
```

### Интеграция с UI компонентами

#### Кнопки быстрых тегов
**Оригинал:**
```jsx
<button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all">
```

**Адаптация:**
```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => handleQuickTag("Как открыть ИП в 2025?")}
  className="gap-1.5 text-xs font-medium hover:border-primary hover:text-primary hover-elevate"
>
  <Briefcase className="w-3 h-3" />
  Открыть ИП
</Button>
```

#### Сообщения чата
**Оригинал:**
```jsx
<div className="inline-block bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-6 py-4 text-slate-700 leading-relaxed shadow-sm max-w-[95%]">
```

**Адаптация:**
```tsx
<Card className="inline-block max-w-[95%] rounded-2xl rounded-tl-sm">
  <CardContent className="px-6 py-4">
    <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
      <Sparkles className="w-4 h-4 text-primary" />
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        ИИ помощник
      </span>
    </div>
    <div className="text-sm leading-relaxed prose prose-slate">
      {renderText(msg.text)}
    </div>
  </CardContent>
</Card>
```

### Адаптация цветов и тем

#### Цветовая схема
```tsx
// Использование CSS переменных проекта
const colors = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  muted: "hsl(var(--muted))",
  background: "hsl(var(--background))",
  card: "hsl(var(--card))",
  border: "hsl(var(--border))",
  foreground: "hsl(var(--foreground))"
};
```

#### Темная тема
Компонент должен автоматически адаптироваться под темную тему через CSS переменные:
- `bg-card/80` вместо `bg-white/80`
- `border-border` вместо `border-slate-200`
- `text-foreground` вместо `text-slate-700`

### Интеграция с системой elevate

#### Hover эффекты
```tsx
// Замена кастомных hover эффектов
<div className="hover-elevate transition-all duration-200">
  {/* Содержимое */}
</div>
```

#### Активные состояния
```tsx
<Button className="active-elevate-2">
  {/* Кнопка */}
</Button>
```

### Оптимизация производительности

#### Мемоизация
```tsx
import { memo, useMemo, useCallback } from 'react';

const StaticTaxSearch = memo(({ className, onMessage, placeholder }: StaticTaxSearchProps) => {
  const renderText = useCallback((text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={`mb-2 last:mb-0 ${line.startsWith('•') ? 'pl-4' : ''}`}>
        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
      </p>
    ));
  }, []);

  const quickTags = useMemo(() => [
    { text: "Как открыть ИП в 2025?", icon: Briefcase },
    { text: "Налог НПД ставки", icon: FileText },
    { text: "Нужна ли касса для ООО?", icon: Search }
  ], []);
  
  // Component logic
});
```

#### Debounce для ввода
```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value: string) => {
    // Поисковая логика
  },
  300
);
```

### Интеграция с роутингом

#### Навигация по результатам
```tsx
import { useLocation } from 'wouter';

const [, setLocation] = useLocation();

const handleNavigate = (path: string) => {
  setLocation(path);
};
```

### Доступность (Accessibility)

#### ARIA атрибуты
```tsx
<div
  role="main"
  aria-label="Поиск по налогам и праву"
  aria-describedby="search-description"
>
  <div id="search-description" className="sr-only">
    AI-помощник для поиска информации о налогах и юридических вопросах
  </div>
  {/* Компонент */}
</div>
```

#### Клавиатурная навигация
```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSearch();
  }
  if (e.key === 'Escape') {
    setIsFocused(false);
  }
};
```

## Финальная структура файла

```typescript
import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { Search, ArrowRight, Sparkles, CornerDownLeft, Loader2, Trash2, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

// Интерфейсы и константы
interface StaticTaxSearchProps {
  className?: string;
  onMessage?: (message: string) => void;
  placeholder?: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-3-pro-preview-11-2025";
const SYSTEM_INSTRUCTION = `Ты — высококвалифицированный виртуальный юрист и налоговый консультант РФ...`;

// Компонент
const StaticTaxSearch: React.FC<StaticTaxSearchProps> = memo(({
  className,
  onMessage,
  placeholder = "Задайте вопрос по налогам или праву..."
}) => {
  // Логика компонента
});

StaticTaxSearch.displayName = "StaticTaxSearch";

export default StaticTaxSearch;
```

## Тестирование адаптации

### Функциональное тестирование
1. Базовый поиск работает корректно
2. Быстрые теги функционируют
3. История сообщений сохраняется
4. Очистка чата работает
5. Обработка ошибок сети

### Визуальное тестирование
1. Адаптация под светлую/темную тему
2. Hover и active состояния
3. Адаптивность на мобильных устройствах
4. Соответствие дизайн-системе
5. Анимации и переходы

### Интеграционное тестирование
1. Взаимодействие с другими компонентами
2. Навигация по приложению
3. Сохранение состояния при роутинге
4. Производительность при большом количестве сообщений

---

**Результат:** Полностью адаптированный компонент StaticTaxSearch, интегрированный с дизайн-системой BizStartMaster