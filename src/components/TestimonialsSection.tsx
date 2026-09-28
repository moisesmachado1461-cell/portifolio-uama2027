import React from 'react';
import { Quote } from 'lucide-react';
import { TestimonialItem } from '../types/index.js';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="depoimentos" className="py-20 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Vozes de Quem Viveu
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            Histórias de transformação & cura
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Leia os relatos sinceros de mulheres que aceitaram o convite de parar, respirar e permitir que Deus fizesse morada em seus corações.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-8 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs flex flex-col justify-between relative group hover:shadow-sm transition-shadow"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[var(--color-accent)]/60 rotate-180" />
                <p className="text-sm text-[var(--color-text-main)] font-serif italic leading-relaxed">
                  "{test.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--color-border)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-serif font-bold text-base shrink-0">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-title)]">
                    {test.name}
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {test.edition}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
