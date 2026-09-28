import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types/index.js';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories
  const categories = ['todos', ...Array.from(new Set(items.map((i) => i.category || 'Geral')))];

  const filteredItems =
    selectedCategory === 'todos'
      ? items
      : items.filter((i) => (i.category || 'Geral').toLowerCase() === selectedCategory.toLowerCase());

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="galeria" className="py-20 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Memórias & Registros
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            Momentos que marcaram corações
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Recordações fotográficas das edições anteriores que retratam a ternura, a amizade sincera e o poder transformador de Deus em nossas vidas.
          </p>
        </div>

        {/* Filter Tabs (Interactive Segmented Control) */}
        {categories.length > 2 && (
          <div className="flex items-center sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-all capitalize whitespace-nowrap shrink-0 min-h-[40px] active:scale-95 ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                    : 'bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                {cat === 'todos' ? 'Todas as Fotos' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] max-w-md mx-auto">
            <ImageIcon className="w-10 h-10 text-[var(--color-text-secondary)] mx-auto mb-3 opacity-60" />
            <p className="text-base font-serif font-medium text-[var(--color-text-title)]">
              Nenhuma foto encontrada nesta categoria
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Selecione outra categoria ou acompanhe as atualizações da coordenação.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-2xl overflow-hidden bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs cursor-pointer aspect-4/3 sm:aspect-square"
              >
                <img
                  src={item.url}
                  alt={item.title || 'Foto do Retiro UAMA'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-[11px] font-semibold text-amber-200">
                        {item.category || 'Retiro UAMA'}
                      </p>
                      <p className="text-xs sm:text-sm font-serif font-medium mt-0.5 truncate">
                        {item.title}
                      </p>
                    </div>
                    <div className="p-1.5 sm:p-2 rounded-lg bg-white/20 backdrop-blur-xs shrink-0">
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-8">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar visualização"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image & Caption */}
          <div className="max-w-4xl max-h-[88vh] flex flex-col items-center justify-center px-6 sm:px-0">
            <img
              src={filteredItems[lightboxIndex].url}
              alt={filteredItems[lightboxIndex].title}
              className="max-w-full max-h-[60vh] sm:max-h-[72vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="text-center mt-3 sm:mt-4 text-white max-w-xl">
              <p className="text-[11px] sm:text-xs uppercase tracking-wider text-amber-300 font-medium">
                {filteredItems[lightboxIndex].category} · Foto {lightboxIndex + 1} de{' '}
                {filteredItems.length}
              </p>
              <h3 className="text-base sm:text-lg font-serif font-medium mt-1 text-balance">
                {filteredItems[lightboxIndex].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
