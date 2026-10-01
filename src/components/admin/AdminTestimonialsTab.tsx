import React, { useState } from 'react';
import { Plus, Trash2, MessageSquareQuote, Check } from 'lucide-react';
import { TestimonialItem } from '../../types/index.js';

interface AdminTestimonialsTabProps {
  testimonials: TestimonialItem[];
  onAddTestimonial: (test: Partial<TestimonialItem>) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
}

export const AdminTestimonialsTab: React.FC<AdminTestimonialsTabProps> = ({
  testimonials,
  onAddTestimonial,
  onDeleteTestimonial,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [edition, setEdition] = useState('');
  const [quote, setQuote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) return;
    setIsSubmitting(true);
    await onAddTestimonial({
      name,
      edition: edition || 'Participante',
      quote,
      isActive: true,
    });
    setIsSubmitting(false);
    setName('');
    setEdition('');
    setQuote('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-title)]">
            Gerenciamento de Depoimentos
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Cadastre depoimentos inspiradores de participantes para edificação e confiança das novas congressistas.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Depoimento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--color-primary)]">
                  {test.edition}
                </span>
                <button
                  onClick={() => onDeleteTestimonial(test.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-serif italic text-[var(--color-text-main)] leading-relaxed">
                "{test.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center font-serif font-bold text-xs text-[var(--color-primary)]">
                {test.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-[var(--color-text-title)]">
                {test.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
              Cadastrar Novo Depoimento
            </h4>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Nome da Participante
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ana Paula Ribeiro"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Edição / Identificação
                </label>
                <input
                  type="text"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  placeholder="Ex: Retiro Edição 2025"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Depoimento / Relato
                </label>
                <textarea
                  rows={4}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Descreva a experiência vivida e o impacto do retiro..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !quote}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Depoimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
