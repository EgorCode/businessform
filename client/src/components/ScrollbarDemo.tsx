import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StaticTaxSearch from './StaticTaxSearch';

const ScrollbarDemo = () => {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Демонстрация улучшенных скроллбаров</h1>
        <p className="text-muted-foreground">
          Скроллбары теперь скрыты по умолчанию и появляются только при наведении или прокрутке
        </p>
      </div>

      {/* Демонстрация диалогового окна с AI-помощником */}
      <Card>
        <CardHeader>
          <CardTitle>AI-помощник по налогам</CardTitle>
          <DialogDescription>
            Нажмите кнопку ниже, чтобы открыть диалоговое окно с улучшенным скроллбаром
          </DialogDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Открыть AI-помощника</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] dialog-scrollbar-hidden">
              <DialogHeader>
                <DialogTitle>AI-помощник по налогам</DialogTitle>
                <DialogDescription>
                  Умный поиск ответов на налоговые вопросы с помощью искусственного интеллекта
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <StaticTaxSearch />
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Демонстрация различных типов скроллбаров */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Стандартный скроллбар</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto p-4 border rounded-md">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="mb-2">
                  Это пример стандартного скроллбара. Элемент #{i + 1}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Улучшенный скроллбар</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto p-4 border rounded-md ai-chat-scrollbar scrolling-indicator">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="mb-2">
                  Это пример улучшенного скроллбара. Наведите курсор или прокрутите, чтобы увидеть его. Элемент #{i + 1}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Инструкции */}
      <Card>
        <CardHeader>
          <CardTitle>Как это работает</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li>Скроллбар скрыт по умолчанию для чистого внешнего вида</li>
            <li>Появляется при наведении курсора на область прокрутки</li>
            <li>Становится видимым во время прокрутки (колесико мыши)</li>
            <li>Имеет плавные переходы для лучшего пользовательского опыта</li>
            <li>Адаптирован для мобильных устройств с уменьшенной шириной</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrollbarDemo;