import React, { useState } from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon, Star, Check } from 'lucide-react';
import { GalleryItem } from '../../types/index.js';

interface AdminGalleryTabProps {
  items: GalleryItem[];
  onAddPhoto: (photo: { url: string; title: string; category: string; isFeatured: boolean }) => Promise<void>;
  onDeletePhoto: (id: string) => Promise<void>;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({
  items,
  onAddPhoto,
  onDeletePhoto,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Comunhão');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsSubmitting(true);
    await onAddPhoto({ url, title, category, isFeatured });
    setIsSubmitting(false);
    setUrl('');
    setTitle('');
    setIsFeatured(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-title)]">
            Gerenciamento da Galeria de Fotos
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Adicione memórias fotográficas dos retiros anteriores, organize por categorias e defina imagens de destaque.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Foto</span>
        </button>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs group relative flex flex-col justify-between"
          >
            <div className="aspect-4/3 overflow-hidden bg-stone-100 relative">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.isFeatured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 font-semibold text-[10px] flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-current" />
                  Destaque
                </span>
              )}
            </div>

            <div className="p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[var(--color-primary)]">
                  {item.category}
                </span>
                <button
                  onClick={() => onDeletePhoto(item.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Excluir foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-serif font-medium text-[var(--color-text-title)] line-clamp-1">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
              Adicionar Nova Foto à Galeria
            </h4>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Imagem
                </label>
                {url ? (
                  <div className="rounded-xl overflow-hidden border border-[var(--color-border)] aspect-16/9 bg-stone-100 relative">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-[10px]"
                    >
                      Trocar Imagem
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] cursor-pointer text-xs text-[var(--color-text-secondary)]">
                      <Upload className="w-6 h-6 text-[var(--color-primary)] mb-1" />
                      <span>Upload do seu computador</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <input
                      type="url"
                      placeholder="Ou cole uma URL da foto..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Título / Legenda
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Noite de Louvor e Ministração"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                >
                  <option value="Comunhão">Comunhão</option>
                  <option value="Palestras">Palestras</option>
                  <option value="Espiritualidade">Espiritualidade</option>
                  <option value="Momentos">Momentos</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[var(--color-primary)]"
                />
                <label htmlFor="featuredCheck" className="text-xs text-[var(--color-text-title)] cursor-pointer">
                  Destacar na página inicial
                </label>
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
                  disabled={isSubmitting || !url}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
