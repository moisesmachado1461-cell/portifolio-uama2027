import React, { useEffect, useState } from 'react';
import { ThemeProvider, DEFAULT_THEME_CONFIG } from '../../context/ThemeContext.js';
import { PublicData } from '../../types/index.js';
import { AdminModal } from './AdminModal.js';

export const AdminPage: React.FC = () => {
  const [publicData, setPublicData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/public-data', { credentials: 'same-origin' });
      if (res.ok) setPublicData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Administração UAMA';
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex,nofollow,noarchive';
    fetchPublicData();
  }, []);

  if (loading || !publicData) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/70 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm">Carregando área administrativa...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider initialTheme={publicData.theme || DEFAULT_THEME_CONFIG}>
      <AdminModal
        isOpen
        onClose={() => { window.location.href = '/'; }}
        eventInfo={publicData.eventInfo}
        gallery={publicData.gallery || []}
        videos={publicData.videos || []}
        testimonials={publicData.testimonials || []}
        onRefreshPublicData={fetchPublicData}
      />
    </ThemeProvider>
  );
};
