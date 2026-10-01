import React, { useState } from 'react';
import { Heart, Music, BookOpen, Coffee, Compass, Smile, Sparkles } from 'lucide-react';

interface ExperiencePillar {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
}

const PILLARS: ExperiencePillar[] = [
  {
    id: 'reflexao',
    icon: BookOpen,
    title: 'Momentos de Reflexão & Oração',
    subtitle: 'Espiritualidade pessoal e intimidade com Deus',
    description: 'Devocionais matinais ao ar livre, capela silenciosa para momentos a sós e vigílias acolhedoras conduzidas com delicadeza e sensibilidade.',
  },
  {
    id: 'palestras',
    icon: Sparkles,
    title: 'Ministrações Inspiradoras',
    subtitle: 'Palavras que tocam o coração e fortalecem a fé',
    description: 'Preletoras convidadas que compartilham reflexões profundas sobre propósito, família, superação de traumas e a jornada da mulher cristã hoje.',
  },
  {
    id: 'musica',
    icon: Music,
    title: 'Louvor & Adoração Intimista',
    subtitle: 'Música que acalma a mente e eleva o espírito',
    description: 'Cânticos acústicos, momentos de celebração vibrante e harmonias que criam uma atmosfera propícia para a presença restauradora de Deus.',
  },
  {
    id: 'comunhao',
    icon: Coffee,
    title: 'Comunhão à Mesa',
    subtitle: 'Refeições saborosas e trocas sinceras',
    description: 'Mesas decoradas com carinho, café da manhã colonial e jantares temáticos que convidam a rir, chorar e criar amizades que durarão para sempre.',
  },
  {
    id: 'natureza',
    icon: Compass,
    title: 'Contato com a Natureza & Descanso',
    subtitle: 'Ar puro, jardins floridos e tranquilidade',
    description: 'Caminhadas contemplativas, bancos sob sombras de árvores centenárias e tempo livre sem pressa para ler, descansar e desacelerar.',
  },
  {
    id: 'integracao',
    icon: Smile,
    title: 'Dinâmicas & Celebração Especial',
    subtitle: 'Surpresas pensadas exclusivamente para você',
    description: 'Atividades lúdicas de integração, homenagens emocionantes e lembranças personalizadas preparadas com amor pela equipe organizadora.',
  },
];

export const ExperienceSection: React.FC = () => {
  const [activePillar, setActivePillar] = useState<string>(PILLARS[0].id);

  const current = PILLARS.find((p) => p.id === activePillar) || PILLARS[0];
  const CurrentIcon = current.icon;

  return (
    <section id="experiencia" className="py-20 bg-[var(--color-bg-main)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            A Experiência
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            O que espera por você no retiro
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Cada detalhe foi sonhado para acolher sua história e proporcionar dias inesquecíveis de restauração, alegria e paz interior.
          </p>
        </div>

        {/* Experience Showcase: Interactive Pillars & Visual Media */}
        {/* Mobile / Tablet Horizontal Tabs (< lg) */}
        <div className="lg:hidden space-y-4 mb-6">
          <div className="flex items-center overflow-x-auto no-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = pillar.id === activePillar;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all shrink-0 active:scale-95 min-h-[44px] ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] border-[var(--color-primary)] shadow-sm'
                      : 'bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{pillar.title.split(' ')[0]} {pillar.title.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Card on Mobile */}
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-[var(--color-card-bg)] border border-[var(--color-card-border)] aspect-4/3 sm:aspect-16/10">
            <img
              src="/src/assets/images/experience_worship_nature_1790618284648.jpg"
              alt={current.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-200 text-[11px] uppercase tracking-wider font-semibold">
                <CurrentIcon className="w-3.5 h-3.5" />
                <span>{current.subtitle}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Showcase (lg and above) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Selector List */}
          <div className="col-span-6 space-y-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = pillar.id === activePillar;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-card-bg)] border-[var(--color-primary)] shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-[var(--color-button-text)]'
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-primary)]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-sm sm:text-base font-semibold ${
                        isSelected
                          ? 'text-[var(--color-text-title)]'
                          : 'text-[var(--color-text-main)]'
                      }`}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-1">
                      {pillar.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Visual Showcase of Selected Pillar */}
          <div className="col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-[var(--color-card-bg)] border border-[var(--color-card-border)] aspect-4/3 sm:aspect-16/10">
              <img
                src="/src/assets/images/experience_worship_nature_1790618284648.jpg"
                alt="Mulheres em contemplação e oração na natureza"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                <div className="flex items-center gap-2 text-amber-200 text-xs uppercase tracking-wider font-semibold">
                  <CurrentIcon className="w-4 h-4" />
                  <span>{current.subtitle}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                  {current.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
