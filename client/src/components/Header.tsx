import { useState } from "react";
import { Link } from "wouter";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import { Sparkles } from "lucide-react";
import { SearchModal } from "@/components/search";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { toggleMinimized } = useAIAssistant();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Основной контейнер Header */}
      <div className="pt-2 md:pt-6 px-4 flex justify-center sticky top-0 z-50">
        <header className="glass-panel rounded-full px-2 py-2 flex justify-between items-center w-full max-w-7xl shadow-glass hover:shadow-glass-hover transition-all duration-500 transform hover:-translate-y-1">

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 px-4 group cursor-pointer" data-testid="link-home">
              {/* Иконка логотипа */}
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                <span className="text-sm font-bold">БФ</span>
              </div>
              {/* Текст логотипа */}
              <span className="font-heading font-bold text-slate-800 tracking-tight text-lg hidden sm:block">БизнесФорма</span>
              <span className="font-heading font-bold text-slate-800 tracking-tight text-lg sm:hidden">БФ</span>
            </div>
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 rounded-full px-1 py-1 border border-white/60">
            <Link href="/start">
              <span className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-300 cursor-pointer" data-testid="link-start">
                Начать сейчас
              </span>
            </Link>
            <Link href="/case-studies">
              <span className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-300 cursor-pointer" data-testid="link-case-studies">
                Истории
              </span>
            </Link>
            <Link href="/calculators">
              <span className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-300 cursor-pointer" data-testid="link-calculators">
                Калькуляторы
              </span>
            </Link>
            <Link href="/news">
              <span className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-300 cursor-pointer" data-testid="link-news">
                Новости
              </span>
            </Link>
            <Link href="/knowledge">
              <span className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-300 cursor-pointer" data-testid="link-knowledge">
                База знаний
              </span>
            </Link>
            <Link href="/documents">
              <span className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-300 cursor-pointer" data-testid="link-documents">
                Документы
              </span>
            </Link>
          </nav>

          {/* Actions Right */}
          <div className="flex items-center gap-2 pl-2 pr-1">
            {/* Поиск */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/50 hover:bg-white text-slate-600 transition-colors duration-300 group"
              title="Поиск"
              aria-label="Открыть поиск по сайту"
            >
              <svg className="w-4 h-4 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Кнопка вызова ИИ-помощника */}
            <button
              onClick={toggleMinimized}
              className="shine-effect bg-slate-900 text-white px-5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 relative h-10"
              data-testid="button-ai-assistant"
              aria-label="Открыть ИИ-помощника"
            >
              <Sparkles className="h-4 w-4" />
              <span>ИИ-помощник</span>
            </button>

            {/* Mobile Menu Button (Burger) */}
            <button
              className="lg:hidden w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-700 hover:bg-white transition-colors ml-1"
              onClick={toggleMobileMenu}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </header>
      </div>

      {/* Mobile Menu Dropdown (Hidden by default) */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-4 right-4 z-40 lg:hidden">
          <div className="glass-panel rounded-2xl p-4 shadow-2xl flex flex-col gap-2 animate-fadeIn">
            <Link href="/start">
              <div
                className="p-3 rounded-xl hover:bg-green-50 text-slate-700 hover:text-green-600 font-medium flex justify-between items-center cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-start"
              >
                Начнём?
                <svg className="w-4 h-4 text-slate-400 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link href="/case-studies">
              <div
                className="p-3 rounded-xl hover:bg-green-50 text-slate-700 hover:text-green-600 font-medium flex justify-between items-center cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-case-studies"
              >
                Кейсы самозанятых
                <svg className="w-4 h-4 text-slate-400 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link href="/calculators">
              <div
                className="p-3 rounded-xl hover:bg-white/60 font-medium text-slate-700 flex justify-between items-center cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-calculators"
              >
                Калькуляторы
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link href="/news">
              <div
                className="p-3 rounded-xl hover:bg-white/60 font-medium text-slate-700 flex justify-between items-center cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-news"
              >
                Новости
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link href="/knowledge">
              <div
                className="p-3 rounded-xl hover:bg-white/60 font-medium text-slate-700 flex justify-between items-center cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-knowledge"
              >
                База знаний
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link href="/documents">
              <div
                className="p-3 rounded-xl hover:bg-white/60 font-medium text-slate-700 flex justify-between items-center cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-documents"
              >
                Документы
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <button
              className="p-3 rounded-xl hover:bg-white/60 font-medium text-slate-700 flex justify-between items-center w-full text-left"
              onClick={() => {
                toggleMinimized();
                setMobileMenuOpen(false);
              }}
              data-testid="button-mobile-ai-assistant"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                ИИ-помощник
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              className="p-3 rounded-xl hover:bg-white/60 font-medium text-slate-700 flex justify-between items-center w-full text-left"
              onClick={() => {
                setSearchModalOpen(true);
                setMobileMenuOpen(false);
              }}
              data-testid="button-mobile-search"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Поиск по сайту
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно поиска */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
