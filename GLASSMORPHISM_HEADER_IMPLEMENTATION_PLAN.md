# План реализации Header в стиле Glassmorphism и Floating Pill

## Обзор
Необходимо реализовать современный header в стиле Glassmorphism (эффект стекла) и Floating Pill (плавающая капсула) - популярный тренд в веб-дизайне ("VisionOS style").

## Текущая структура
- **Header.tsx**: Базовый компонент с простой навигацией
- **index.css**: Содержит базовые стили и анимации для плавающей кнопки ИИ
- **Использование**: Header импортируется в отдельных страницах (AIHome.tsx и др.)

## Требования к новому Header

### 1. Дизайн и стили
- **Glassmorphism эффект**: Полупрозрачный фон с размытием (backdrop-filter: blur(16px))
- **Floating Pill**: Скругленная форма (rounded-full) с тенью и hover-эффектами
- **Анимации**: Плавные переходы, эффект блика на кнопках
- **Цветовая схема**: Белый полупрозрачный фон с градиентными элементами

### 2. Структура компонента
```
Header Container (sticky, centered)
├── Logo (слева)
├── Navigation (центр, десктоп)
│   ├── Мастер выбора
│   ├── Сравнение
│   ├── Калькуляторы
│   └── Документы
└── Actions (справа)
    ├── Поиск (иконка)
    ├── База знаний (кнопка с бликом)
    └── Mobile Menu (бургер)
```

### 3. Мобильная адаптация
- **Мобильное меню**: Выпадающее меню с Glassmorphism эффектом
- **Адаптивность**: Различные размеры для 320px-768px
- **Touch-friendly**: Увеличенные области нажатия

## План реализации

### Шаг 1: CSS стили для Glassmorphism
Добавить в `index.css`:
```css
/* Основной стиль стекла */
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* Эффект блика на кнопке */
.shine-effect {
  position: relative;
  overflow: hidden;
}

.shine-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent);
  transform: skewX(-25deg);
  transition: 0.5s;
}

.shine-effect:hover::after {
  left: 150%;
  transition: 0.7s ease-in-out;
}

/* Тени для Glassmorphism */
.shadow-glass {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}

.shadow-glass-hover {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

/* Анимация появления мобильного меню */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

### Шаг 2: Новый компонент Header
Создать обновленный `Header.tsx` с:
- Glassmorphism контейнером
- Floating Pill дизайном
- Адаптивной навигацией
- Мобильным меню с анимацией
- Эффектом блика на кнопке "База знаний"

### Шаг 3: Интеграция иконок
- Добавить Font Awesome иконки
- Настроить логотип с градиентным фоном
- Реализовать иконку поиска

### Шаг 4: Мобильное меню
- Выпадающее меню с Glassmorphism эффектом
- Анимация появления/исчезновения
- Touch-friendly элементы

### Шаг 5: Тестирование
- Проверка адаптивности на разных размерах экрана
- Тестирование функциональности меню
- Проверка производительности анимаций

## Технические детали

### Структура JSX
```jsx
<div className="pt-6 px-4 flex justify-center sticky top-0 z-50">
  <header className="glass-panel rounded-full px-2 py-2 flex justify-between items-center w-full max-w-5xl shadow-glass hover:shadow-glass-hover transition-all duration-500 transform hover:-translate-y-1">
    {/* Logo */}
    <a href="#" className="flex items-center gap-3 px-4 group">
      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
        <i className="fa-solid fa-layer-group text-sm"></i>
      </div>
      <span className="font-heading font-bold text-slate-800 tracking-tight text-lg hidden sm:block">БизнесФорма</span>
      <span className="font-heading font-bold text-slate-800 tracking-tight text-lg sm:hidden">БФ</span>
    </a>

    {/* Navigation */}
    <nav className="hidden lg:flex items-center gap-1 bg-white/50 rounded-full px-1.5 py-1.5 border border-white/60">
      {/* Навигационные ссылки */}
    </nav>

    {/* Actions */}
    <div className="flex items-center gap-2 pl-2 pr-1">
      {/* Поиск, кнопка, мобильное меню */}
    </div>
  </header>
</div>
```

### Мобильное меню
```jsx
<div id="mobile-menu" className="hidden fixed top-24 left-4 right-4 z-40">
  <div className="glass-panel rounded-2xl p-4 shadow-2xl flex flex-col gap-2 animate-fadeIn">
    {/* Мобильные ссылки */}
  </div>
</div>
```

## Следующие шаги
1. Переключиться в режим Code
2. Добавить CSS стили в index.css
3. Обновить компонент Header.tsx
4. Протестировать на всех страницах
5. Оптимизировать производительность

## Ожидаемый результат
Современный header в стиле VisionOS с Glassmorphism эффектом, плавными анимациями и полной адаптивностью для всех устройств.