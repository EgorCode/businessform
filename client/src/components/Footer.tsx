import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Продукт</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/wizard">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-wizard">
                    Мастер подбора бизнеса
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/comparison">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-comparison">
                    Сравнение ИП/ООО/Самозанятость
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/calculators">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-calculators">
                    Калькуляторы
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/documents">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-documents">
                    Документы
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Ресурсы</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/news">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-news">
                    Новости
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/knowledge">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-knowledge">
                    База знаний
                  </span>
                </Link>
              </li>
              <li>
                <a href="https://t.me/+fwAIYLOHTMI5OGQy" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">
                  Телеграмм-канал
                </a>
              </li>
              <li>
                <Link href="/faq">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-faq">
                    FAQ
                  </span>
                </Link>
              </li>
              <li>
                <a href="https://t.me/+hXZ2a1ltQORiYWZi" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-support">
                  Поддержка
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Компания</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-about">
                    О нас
                  </span>
                </Link>
              </li>
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contacts">
                  Контакты
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">
                  Условия использования
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Актуальность</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Вся информация на платформе актуализирована в соответствии с законодательством РФ на 2026 год.
              ИИ-помощник может допускать ошибки. Проверяйте важную информацию.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ИИ-помощник может допускать ошибки. Проверяйте важную информацию.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">Обновлено: 2026</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              © 2026 БизнесФорма. Все права защищены.
            </p>
            <div className="flex gap-6">
              <a href="https://t.me/+fwAIYLOHTMI5OGQy" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-telegram">
                Telegram
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-vk">
                VK
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
