import React from 'react';
import { Sparkles, Calendar, ArrowRight, HeartHandshake, ShieldCheck, Info } from 'lucide-react';
import { EventInfo } from '../types/index.js';

interface HeroProps {
  eventInfo: EventInfo;
  onOpenFlyerModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ eventInfo, onOpenFlyerModal }) => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background Subtle Gradient & Organic Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-secondary)]/50 via-[var(--color-bg-main)] to-[var(--color-bg-main)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Curatorial Metadata Line (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-medium text-[var(--color-text-secondary)]">
              <span>União de Acolhimento de Mulheres</span>
              <span aria-hidden="true">·</span>
              <span>Edição Anual</span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--color-primary)] font-semibold">Setembro · 3 Dias</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[var(--color-text-title)] tracking-tight leading-[1.18] text-balance break-words">
              Retiro Anual de Mulheres <span className="italic font-normal text-[var(--color-primary)]">UAMA</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-[var(--color-text-main)]/90 leading-relaxed max-w-2xl font-normal">
              {eventInfo.subtitle ||
                'Um tempo precioso de renovação espiritual, comunhão genuína e descanso para o coração de cada mulher.'}
            </p>

            {/* Scripture Verse Quote */}
            <div className="border-l-2 border-[var(--color-accent)] pl-3.5 sm:pl-4 py-1 my-3 sm:my-4">
              <p className="text-xs sm:text-base font-serif italic text-[var(--color-text-title)] leading-relaxed">
                "{eventInfo.themeVerse || 'Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis.'}"
              </p>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mt-1 font-medium">
                — {eventInfo.themeVerseReference || 'Provérbios 31:10'}
              </p>
            </div>

            {/* Official Notice Alert - Respecting the user brief on flyer waiting */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-start gap-2.5 sm:gap-3 shadow-2xs">
              <Info className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[var(--color-text-main)] space-y-1">
                <p className="font-semibold text-[var(--color-text-title)] flex flex-wrap items-center gap-1 sm:gap-1.5">
                  <span>Informações Oficiais do Retiro</span>
                  {!eventInfo.isDateConfirmed && (
                    <span className="text-[10px] sm:text-[11px] font-normal text-[var(--color-secondary)] uppercase tracking-wider">
                      (Aguardando Cartaz Oficial)
                    </span>
                  )}
                </p>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-xs sm:text-sm">
                  {eventInfo.importantNotice}
                </p>
                {eventInfo.officialFlyerUrl && (
                  <button
                    onClick={onOpenFlyerModal}
                    className="text-xs font-semibold text-[var(--color-link)] underline hover:opacity-80 pt-1 block"
                  >
                    Visualizar Cartaz Oficial Publicado
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => scrollTo('#inscricao')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-95 shadow-sm transition-all hover:translate-y-[-1px] active:translate-y-[0px] flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Garantir Pré-Inscrição</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('#sobre')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-[var(--color-text-main)] bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center justify-center min-h-[44px]"
              >
                Conhecer a Experiência
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Inscrição Segura & Vagas Limitadas</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[var(--color-secondary)] shrink-0" />
                <span>Acolhimento Integral & Pensão Completa</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Hero Visual Anchor */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame Line */}
              <div className="absolute -inset-2 sm:-inset-3 rounded-2xl border border-[var(--color-border)]/60 transform rotate-1 pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-[var(--color-card-bg)] border border-[var(--color-card-border)] aspect-4/3 sm:aspect-16/10 lg:aspect-4/5">
                <img
                  src="/src/assets/images/hero_women_retreat_1790618255314.jpg"
                  alt="Mulheres em comunhão e oração durante o retiro UAMA"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Editorial Scrim Overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                  <p className="text-[11px] sm:text-xs uppercase tracking-widest text-amber-200/90 font-medium">
                    Comunhão · Oração · Descanso
                  </p>
                  <p className="text-sm sm:text-base font-serif font-medium mt-1 text-white">
                    Três dias consagrados ao renovo espiritual e laços fraternos
                  </p>
                </div>
              </div>

              {/* Float Card Indicator */}
              <div className="absolute bottom-2 left-2 sm:-bottom-4 sm:-left-4 md:-bottom-6 md:-left-6 bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-xl p-2.5 sm:p-3.5 shadow-md max-w-[200px] sm:max-w-[240px]">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-title)]">
                      Setembro Anual
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[var(--color-text-secondary)]">
                      3 dias de imersão completa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
