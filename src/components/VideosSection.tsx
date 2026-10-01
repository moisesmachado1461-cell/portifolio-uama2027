import React, { useState } from 'react';
import { Play, X, Film } from 'lucide-react';
import { VideoItem } from '../types/index.js';

interface VideosSectionProps {
  videos: VideoItem[];
}

export const VideosSection: React.FC<VideosSectionProps> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  if (!videos || videos.length === 0) return null;

  return (
    <section id="videos" className="py-20 bg-[var(--color-bg-main)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Vídeos & Mensagens
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            Sinta a atmosfera do nosso encontro
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Assista aos melhores momentos das edições anteriores e sinta um pouco do carinho e da unção que nos esperam neste ano.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-2xl overflow-hidden bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => setActiveVideo(vid)}
                className="relative aspect-16/9 bg-stone-900 cursor-pointer overflow-hidden"
              >
                <img
                  src={vid.thumbnailUrl || '/src/assets/images/about_retreat_moment_1790618270317.jpg'}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                </div>

                {vid.duration && (
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono">
                    {vid.duration}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
                    {vid.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(vid)}
                    className="text-xs font-semibold text-[var(--color-link)] hover:underline flex items-center gap-1.5"
                  >
                    <span>Assistir agora</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              aria-label="Fechar vídeo"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Iframe Container */}
            <div className="relative aspect-16/9 w-full bg-black">
              <iframe
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title Bar below video */}
            <div className="p-4 bg-stone-900 text-white">
              <h4 className="text-base font-serif font-medium">{activeVideo.title}</h4>
              <p className="text-xs text-stone-400 mt-0.5">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
