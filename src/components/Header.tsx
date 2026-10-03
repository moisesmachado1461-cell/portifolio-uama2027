import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-bg-main)]/95 backdrop-blur-md shadow-xs border-b border-[var(--color-border)] py-3'
          : 'bg-[var(--color-bg-main)]/80 backdrop-blur-xs py-4 border-b border-[var(--color-border)]/50'
      }`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-[var(--color-text-title)] hover:opacity-90 transition-opacity shrink-0">
            Retiro UAMA
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--color-text-main)]">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="relative py-1 transition-colors hover:text-[var(--color-primary)]">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a href="#inscricao" onClick={(e) => handleNavClick(e, '#inscricao')} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-95 shadow-xs transition-transform active:scale-95 whitespace-nowrap min-h-[40px] flex items-center justify-center">
              <span className="hidden sm:inline">Inscreva-se</span><span className="sm:hidden">Inscrição</span>
            </a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 lg:hidden rounded-xl text-[var(--color-text-main)] hover:bg-[var(--color-bg-secondary)] min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label="Menu principal">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-xs h-[100dvh] bg-[var(--color-bg-main)] border-l border-[var(--color-border)] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
                <span className="font-serif font-bold text-lg text-[var(--color-text-title)]">Menu UAMA</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]" aria-label="Fechar menu"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col space-y-1 py-4">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-base font-medium text-[var(--color-text-main)] py-3 px-2 rounded-lg hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-between">
                    <span>{link.label}</span><span className="text-xs text-[var(--color-text-secondary)]">→</span>
                  </a>
                ))}
              </div>
            </div>
            <a href="#inscricao" onClick={(e) => handleNavClick(e, '#inscricao')} className="w-full text-center py-3.5 text-sm font-semibold rounded-xl text-[var(--color-button-text)] bg-[var(--color-button-bg)] shadow-sm">Garantir Inscrição</a>
          </nav>
        </div>
      )}
    </>
  );
};
