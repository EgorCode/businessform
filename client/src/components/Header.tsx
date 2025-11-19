import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-xl font-bold" data-testid="link-home">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-lg font-bold">БФ</span>
              </div>
              <span>БизнесФорма</span>
            </a>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#wizard">
              <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-wizard">
                Мастер выбора
              </a>
            </Link>
            <Link href="#comparison">
              <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-comparison">
                Сравнение форм
              </a>
            </Link>
            <Link href="#calculators">
              <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-calculators">
                Калькуляторы
              </a>
            </Link>
            <Link href="#documents">
              <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-documents">
                Документы
              </a>
            </Link>
            <Link href="#knowledge">
              <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-knowledge">
                База знаний
              </a>
            </Link>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Button data-testid="button-start">
              Начать
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link href="#wizard">
                <a className="text-sm font-medium" data-testid="link-mobile-wizard">
                  Мастер выбора
                </a>
              </Link>
              <Link href="#comparison">
                <a className="text-sm font-medium" data-testid="link-mobile-comparison">
                  Сравнение форм
                </a>
              </Link>
              <Link href="#calculators">
                <a className="text-sm font-medium" data-testid="link-mobile-calculators">
                  Калькуляторы
                </a>
              </Link>
              <Link href="#documents">
                <a className="text-sm font-medium" data-testid="link-mobile-documents">
                  Документы
                </a>
              </Link>
              <Link href="#knowledge">
                <a className="text-sm font-medium" data-testid="link-mobile-knowledge">
                  База знаний
                </a>
              </Link>
              <Button className="w-full" data-testid="button-mobile-start">
                Начать
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
