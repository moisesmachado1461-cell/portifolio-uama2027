import React, { useState, useEffect } from 'react';
import { CalendarHeart, ArrowRight } from 'lucide-react';

export const MobileQuickBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 350px (past hero)
      const scrollY = window.scrollY;
      const registrationEl = document.getElementById('inscricao');
      
      let pastForm = false;
      if (registrationEl) {
        const rect = registrationEl.getBoundingClientRect();
        // Hide if user is currently looking at or inside the registration form
        if (rect.top <= window.innerHeight * 0.7 && rect.bottom >= 0) {
          pastForm = true;
        }
      }

      setIsVisible(scrollY > 380 && !pastForm);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRegistration = () => {
    const el = document.getElementById('inscricao');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Barra de ação rápida para celular"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[var(--color-bg-main)]/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg animate-in slide-in-from-bottom duration-300 safe-pb"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
            <CalendarHeart className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-serif font-bold text-[var(--color-text-title)] truncate">
              Retiro de Mulheres
            </p>
            <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
              Setembro · 3 dias de imersão
            </p>
          </div>
        </div>

        <button
          onClick={scrollToRegistration}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] shadow-sm active:scale-95 transition-transform flex items-center gap-1.5 shrink-0 min-h-[44px]"
        >
          <span>Inscreva-se</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
