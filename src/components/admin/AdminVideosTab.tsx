import React, { useState } from 'react';
import { Plus, Trash2, Film, Check, ExternalLink } from 'lucide-react';
import { VideoItem } from '../../types/index.js';

interface AdminVideosTabProps {
  videos: VideoItem[];
  onAddVideo: (video: Partial<VideoItem>) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
}

export const AdminVideosTab: React.FC<AdminVideosTabProps> = ({
  videos,
  onAddVideo,
  onDeleteVideo,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('03:30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !embedUrl) return;
    setIsSubmitting(true);
    await onAddVideo({
      title,
      description,
      embedUrl,
      thumbnailUrl,
      duration,
      isActive: true,
    });
    setIsSubmitting(false);
    setTitle('');
    setDescription('');
    setEmbedUrl('');
    setThumbnailUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-title)]">
            Gerenciamento de Vídeos
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Cadastre os vídeos de retrospectiva ou mensagens da coordenação (suporta links de embed do YouTube/Vimeo).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Vídeo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[var(--color-primary)]" />
                  <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
                    {vid.title}
                  </h4>
                </div>
                <button
                  onClick={() => onDeleteVideo(vid.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {vid.description}
              </p>

              <div className="p-2 rounded-lg bg-[var(--color-bg-secondary)] text-[11px] font-mono text-[var(--color-text-secondary)] truncate">
                {vid.embedUrl}
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
              <span>Duração: {vid.duration || '03:00'}</span>
              <span className="text-emerald-700 font-semibold">Ativo no site</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
              Cadastrar Novo Vídeo
            </h4>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Título do Vídeo
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Melhores Momentos da Edição 2025"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  URL de Embed (YouTube / Vimeo)
                </label>
                <input
                  type="url"
                  required
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/XXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  URL da Thumbnail (Opcional)
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://exemplo.com/thumb.jpg"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve resumo sobre o vídeo..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
                  Duração
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="04:15"
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
                  disabled={isSubmitting || !title || !embedUrl}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
