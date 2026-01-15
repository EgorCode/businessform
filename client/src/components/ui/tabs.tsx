import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// Логирование для диагностики проблем с отображением на мобильных устройствах
const logTabIssues = (element: HTMLElement, tabType: string) => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    const rect = element.getBoundingClientRect();
    const isOverflowing = element.scrollWidth > element.offsetWidth;
    
    if (isOverflowing) {
      console.warn(`⚠️ ${tabType} ПЕРЕПОЛНЕНИЕ НА МОБИЛЬНОМ:`, {
        width: element.offsetWidth,
        scrollWidth: element.scrollWidth,
        overflow: element.scrollWidth - element.offsetWidth,
        text: element.textContent
      });
    }
  }
};

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const triggerRef = React.useRef<HTMLElement>(null);
  
  React.useEffect(() => {
    if (triggerRef.current) {
      // Проверка на проблемы с отображением на мобильных устройствах
      const checkMobileDisplay = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          console.log('🔍 ПРОВЕРКА TABS TRIGGER НА МОБИЛЬНОМ:');
          console.log('Текст:', triggerRef.current?.textContent);
          console.log('Ширина элемента:', triggerRef.current?.offsetWidth);
          console.log('Ширина текста:', triggerRef.current?.scrollWidth);
          
          // Проверка на переполнение
          if (triggerRef.current && triggerRef.current.scrollWidth > triggerRef.current.offsetWidth) {
            console.error('❌ ПЕРЕПОЛНЕНИЕ ТЕКСТА В TABS TRIGGER:', {
              text: triggerRef.current.textContent,
              elementWidth: triggerRef.current.offsetWidth,
              textWidth: triggerRef.current.scrollWidth,
              overflow: triggerRef.current.scrollWidth - triggerRef.current.offsetWidth
            });
          }
        }
      };
      
      // Проверка при монтировании
      setTimeout(checkMobileDisplay, 100);
      
      // Проверка при изменении размера окна
      window.addEventListener('resize', checkMobileDisplay);
      return () => window.removeEventListener('resize', checkMobileDisplay);
    }
  }, []);

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        if (triggerRef) {
          (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  );
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    style={{
      // Убедимся, что TabsContent правильно управляет высотой
      height: 'inherit',
      minHeight: 'inherit',
      overflow: 'hidden'
    }}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
