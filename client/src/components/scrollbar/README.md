# Улучшенные скроллбары

Этот компонент предоставляет современные, минималистичные скроллбары, которые скрыты по умолчанию и появляются только при необходимости.

## Особенности

- **Скрыты по умолчанию**: Скроллбары не видны до тех пор, пока пользователь не наведет курсор или не начнет прокрутку
- **Плавные переходы**: Плавная анимация появления и исчезновения
- **Адаптивный дизайн**: Оптимизирован для мобильных устройств
- **Кроссбраузерность**: Работает во всех современных браузерах

## Использование

### CSS классы

#### `ai-chat-scrollbar`
Основной класс для чатов и диалоговых окон с ИИ-помощником.

```tsx
<div className="ai-chat-scrollbar">
  {/* Контент с прокруткой */}
</div>
```

#### `dialog-scrollbar-hidden`
Специальный класс для диалоговых окон, где скроллбар должен быть полностью скрыт до взаимодействия.

```tsx
<DialogContent className="dialog-scrollbar-hidden">
  {/* Содержимое диалога */}
</DialogContent>
```

#### `scrolling-indicator`
Добавляет визуальный индикатор прокрутки, который появляется во время скроллинга.

```tsx
<div className="scrolling-indicator">
  {/* Контент с индикатором прокрутки */}
</div>
```

### React хук

#### `useScrollDetection`
Хук для обнаружения состояния прокрутки элемента.

```tsx
import { useScrollDetection } from '@/hooks/useScrollDetection';

const MyComponent = () => {
  const { isScrolling, elementRef } = useScrollDetection();
  
  return (
    <div 
      ref={elementRef}
      className={`ai-chat-scrollbar ${isScrolling ? 'scrolling' : ''}`}
    >
      {/* Контент */}
    </div>
  );
};
```

## Примеры использования

### 1. Диалоговое окно с AI-помощником

```tsx
<Dialog>
  <DialogTrigger>
    <Button>Открыть AI-помощника</Button>
  </DialogTrigger>
  <DialogContent className="max-w-4xl max-h-[90vh] dialog-scrollbar-hidden">
    <DialogHeader>
      <DialogTitle>AI-помощник</DialogTitle>
    </DialogHeader>
    <StaticTaxSearch />
  </DialogContent>
</Dialog>
```

### 2. Чат с динамическим скроллбаром

```tsx
const ChatComponent = () => {
  const { isScrolling, elementRef } = useScrollDetection();
  
  return (
    <div 
      ref={elementRef}
      className={cn(
        "ai-chat-scrollbar scrolling-indicator",
        isScrolling && "scrolling"
      )}
    >
      {messages.map(message => (
        <Message key={message.id} content={message.content} />
      ))}
    </div>
  );
};
```

## Технические детали

### CSS переменные

Скроллбары используют следующие CSS переменные для настройки:

```css
.ai-chat-scrollbar {
  scrollbar-width: none; /* Firefox */
}

.ai-chat-scrollbar::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.ai-chat-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
  transition: background 0.2s ease;
}

.ai-chat-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(120,120,120,0.3);
}
```

### Мобильная адаптация

Для мобильных устройств ширина скроллбара уменьшена:

```css
@media (max-width: 768px) {
  .ai-chat-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
}
```

## Доступность

- Скроллбары сохраняют полную функциональность клавиатурной навигации
- Поддерживаются жесты прокрутки на сенсорных устройствах
- Сохраняется доступность для пользователей экранных читалок

## Совместимость

- **Chrome/Edge**: Полная поддержка через `-webkit-scrollbar`
- **Firefox**: Поддержка через `scrollbar-width` и `scrollbar-color`
- **Safari**: Поддержка через `-webkit-scrollbar`
- **Мобильные**: Оптимизированная ширина и сенсорная поддержка