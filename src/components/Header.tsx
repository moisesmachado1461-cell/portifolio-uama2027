import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, CalendarHeart, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Sobre o Retiro', href: '#sobre' },
    { label: 'Informações', href: '#informacoes' },
    { label: 'Experiência', href: '#experiencia' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Vídeos', href: '#videos' },
    { label: 'Depoimentos', href: '#depoimentos' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { theme, setThemeMode, saveThemeToServer } = useTheme();
  const isDarkMode = theme.mode === 'dark';

  const handleToggleThemeQuick = async () => {
    if (isAdminLoggedIn) {
      const nextMode = isDarkMode ? 'light' : 'dark';
      setThemeMode(nextMode, true);
      await saveThemeToServer();
    } else {
      // If not logged in as admin, clicking opens admin login/modal
      onOpenAdmin();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--color-bg-main)]/95 backdrop-blur-md shadow-xs border-b border-[var(--color-border)] py-3'
            : 'bg-[var(--color-bg-main)]/80 backdrop-blur-xs py-4 border-b border-[var(--color-border)]/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <a
            href="#"
            className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-[var(--color-text-title)] hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
          >
            <span>Retiro UAMA</span>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--color-text-main)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative py-1 transition-colors hover:text-[var(--color-primary)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--color-primary)] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Indicator / Admin quick toggle */}
            <button
              onClick={handleToggleThemeQuick}
              className="p-2 rounded-xl text-xs font-medium border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center gap-1.5 min-w-[40px] min-h-[40px] justify-center active:scale-95"
              title={
                isAdminLoggedIn
                  ? `Tema atual: ${isDarkMode ? 'Escuro' : 'Claro'} (Clique para alternar e salvar)`
                  : `Tema do Site: ${isDarkMode ? 'Escuro (Dark)' : 'Claro (Light)'} (Definido pelo Admin)`
              }
              aria-label="Alternar Tema Claro/Escuro"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600" />
              )}
              <span className="hidden md:inline text-[11px] font-medium">
                {isDarkMode ? 'Tema Escuro' : 'Tema Claro'}
              </span>
            </button>

            {/* Admin trigger button (accessible in mobile drawer when screen < 420px) */}
            <button
              onClick={onOpenAdmin}
              className={`hidden min-[420px]:flex p-2 rounded-xl text-xs font-medium border transition-colors items-center gap-1.5 min-w-[40px] min-h-[40px] justify-center active:scale-95 ${
                isAdminLoggedIn
                  ? 'border-emerald-600/30 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
              }`}
              title={isAdminLoggedIn ? 'Painel Administrativo Ativo' : 'Acesso da Coordenação'}
              aria-label="Acesso Administrativo"
            >
              <Shield className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="hidden sm:inline">
                {isAdminLoggedIn ? 'Painel' : 'Admin'}
              </span>
            </button>

            {/* Inscrição CTA */}
            <a
              href="#inscricao"
              onClick={(e) => handleNavClick(e, '#inscricao')}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-95 shadow-xs transition-transform active:scale-95 whitespace-nowrap min-h-[40px] flex items-center justify-center"
            >
              <span className="hidden sm:inline">Inscreva-se</span>
              <span className="sm:hidden">Inscrição</span>
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-xl text-[var(--color-text-main)] hover:bg-[var(--color-bg-secondary)] focus:outline-hidden min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-xs sm:max-w-sm h-[100dvh] bg-[var(--color-bg-main)] border-l border-[var(--color-border)] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
                <span className="font-serif font-bold text-lg text-[var(--color-text-title)]">
                  Menu UAMA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-1 py-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-base font-medium text-[var(--color-text-main)] py-3 px-2 rounded-lg hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">→</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-2.5 safe-pb">
              <a
                href="#inscricao"
                onClick={(e) => handleNavClick(e, '#inscricao')}
                className="w-full text-center py-3.5 text-sm font-semibold rounded-xl text-[var(--color-button-text)] bg-[var(--color-button-bg)] shadow-sm active:scale-98 transition-transform"
              >
                Garantir Inscrição
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-center py-3 text-xs font-semibold rounded-xl border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Painel da Coordenação</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
