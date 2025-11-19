import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Продукт</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#wizard">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-wizard">
                    Мастер выбора
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#comparison">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-comparison">
                    Сравнение форм
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#calculators">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-calculators">
                    Калькуляторы
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#documents">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-documents">
                    Документы
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Ресурсы</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#knowledge">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-knowledge">
                    База знаний
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">
                  Блог
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-faq">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-support">
                  Поддержка
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Компания</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contacts">
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
              Вся информация на платформе актуализирована в соответствии с законодательством РФ на 2024 год
            </p>
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">Обновлено: Ноябрь 2024</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              © 2024 БизнесФорма. Все права защищены.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-telegram">
                Telegram
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-vk">
                VK
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-youtube">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
