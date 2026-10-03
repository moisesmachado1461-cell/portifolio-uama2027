import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Users,
  Palette,
  FileText,
  Image as ImageIcon,
  Film,
  MessageSquareQuote,
  KeyRound,
  LogOut,
  Shield,
} from 'lucide-react';
import { AdminLogin } from './AdminLogin.js';
import { AdminDashboardTab } from './AdminDashboardTab.js';
import { AdminRegistrationsTab } from './AdminRegistrationsTab.js';
import { AdminThemeEditorTab } from './AdminThemeEditorTab.js';
import { AdminContentTab } from './AdminContentTab.js';
import { AdminGalleryTab } from './AdminGalleryTab.js';
import { AdminVideosTab } from './AdminVideosTab.js';
import { AdminTestimonialsTab } from './AdminTestimonialsTab.js';
import { AdminSecurityTab } from './AdminSecurityTab.js';
import { EventInfo, Registration, GalleryItem, VideoItem, TestimonialItem, AdminStats } from '../../types/index.js';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventInfo: EventInfo;
  gallery: GalleryItem[];
  videos: VideoItem[];
  testimonials: TestimonialItem[];
  onRefreshPublicData: () => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  eventInfo,
  gallery,
  videos,
  testimonials,
  onRefreshPublicData,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<string>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [stats, setStats] = useState<AdminStats>({
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    pendingRegistrations: 0,
    cancelledRegistrations: 0,
    totalGallery: gallery.length,
    totalVideos: videos.length,
    totalTestimonials: testimonials.length,
  });

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && token) {
      fetchAdminData();
    }
  }, [isOpen, token]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check-auth', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.username || 'admin');
        setToken('session-cookie');
      } else {
        setToken(null);
      }
    } catch {
      setToken(null);
    }
  };

  const fetchAdminData = async () => {

    try {
      const [statsRes, regsRes] = await Promise.all([
        fetch('/api/admin/stats', { credentials: 'same-origin' }),
        fetch('/api/admin/registrations', { credentials: 'same-origin' }),
      ]);

      if (statsRes.status === 401 || regsRes.status === 401) {
        handleLogout();
        return;
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (regsRes.ok) {
        const regsData = await regsRes.json();
        setRegistrations(regsData);
      }
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    }
  };

  const handleLoginSuccess = (user: string) => {
    setAdminUser(user);
    setToken('session-cookie');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch {
      // A sessão local é encerrada mesmo se a rede falhar.
    }
    setToken(null);
    setAdminUser('admin');
  };

  const handleUpdateRegistrationStatus = async (
    id: string,
    newStatus: 'pendente' | 'confirmada' | 'cancelada'
  ) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (e) {
      console.error('Failed to delete registration', e);
    }
  };

  const handleUpdateEventInfo = async (newInfo: Partial<EventInfo>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/event-info', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInfo),
      });
      if (res.ok) {
        await onRefreshPublicData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleAddPhoto = async (photo: { url: string; title: string; category: string; isFeatured: boolean }) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      });
      if (res.ok) {
        await onRefreshPublicData();
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
      });
      if (res.ok) {
        await onRefreshPublicData();
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddVideo = async (video: Partial<VideoItem>) => {
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });
      if (res.ok) {
        await onRefreshPublicData();
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/videos/${id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
      });
      if (res.ok) {
        await onRefreshPublicData();
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTestimonial = async (test: Partial<TestimonialItem>) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test),
      });
      if (res.ok) {
        await onRefreshPublicData();
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
          method: 'DELETE',
          credentials: 'same-origin',
      });
      if (res.ok) {
        await onRefreshPublicData();
        await fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-[var(--color-card-bg)] border-0 sm:border border-[var(--color-card-border)] rounded-none sm:rounded-3xl w-full max-w-7xl h-full sm:h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-secondary)] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-serif font-bold text-[var(--color-text-title)] truncate">
                Painel Administrativo UAMA
              </h2>
              <p className="text-[10px] sm:text-[11px] text-[var(--color-text-secondary)] truncate">
                Retiro Anual de Mulheres · Gestão Completa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {token && (
              <span className="hidden md:inline text-xs text-[var(--color-text-secondary)]">
                Conectada como: <strong className="text-[var(--color-text-title)]">{adminUser}</strong>
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)] hover:text-[var(--color-text-title)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!token ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            <AdminLogin onLoginSuccess={handleLoginSuccess} onCancel={onClose} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Mobile Horizontal Tabs (< md) */}
            <div className="flex md:hidden overflow-x-auto items-center gap-2 p-2.5 bg-[var(--color-bg-secondary)]/90 border-b border-[var(--color-border)] no-scrollbar shrink-0">
              {[
                { id: 'dashboard', label: 'Geral', icon: LayoutDashboard },
                { id: 'registrations', label: `Inscrições (${stats.totalRegistrations})`, icon: Users },
                { id: 'theme', label: 'Cores', icon: Palette },
                { id: 'content', label: 'Conteúdo', icon: FileText },
                { id: 'gallery', label: 'Galeria', icon: ImageIcon },
                { id: 'videos', label: 'Vídeos', icon: Film },
                { id: 'testimonials', label: 'Relatos', icon: MessageSquareQuote },
                { id: 'security', label: 'Senha', icon: KeyRound },
              ].map((tabItem) => {
                const TabIcon = tabItem.icon;
                const isSelected = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => setActiveTab(tabItem.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors shrink-0 min-h-[38px] active:scale-95 ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                        : 'bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tabItem.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200 whitespace-nowrap shrink-0 flex items-center gap-1 min-h-[38px] active:scale-95"
                title="Sair"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>

            {/* Desktop Sidebar Navigation (md and above) */}
            <aside className="hidden md:flex w-56 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-4 flex-col justify-between shrink-0 overflow-y-auto">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Visão Geral</span>
                </button>

                <button
                  onClick={() => setActiveTab('registrations')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    activeTab === 'registrations'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Inscrições</span>
                  </div>
                  {stats.totalRegistrations > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                        activeTab === 'registrations' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {stats.totalRegistrations}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('theme')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'theme'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Editor de Cores</span>
                </button>

                <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'content'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Dados & Cartaz</span>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'gallery'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Galeria de Fotos</span>
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'videos'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Vídeos</span>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'testimonials'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Depoimentos</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'security'
                      ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Segurança</span>
                </button>
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto bg-[var(--color-card-bg)]">
              {activeTab === 'dashboard' && (
                <AdminDashboardTab
                  stats={stats}
                  recentRegistrations={registrations}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'registrations' && (
                <AdminRegistrationsTab
                  registrations={registrations}
                  onUpdateStatus={handleUpdateRegistrationStatus}
                  onDeleteRegistration={handleDeleteRegistration}
                  onRefresh={fetchAdminData}
                />
              )}

              {activeTab === 'theme' && <AdminThemeEditorTab />}

              {activeTab === 'content' && (
                <AdminContentTab
                  eventInfo={eventInfo}
                  onUpdateEventInfo={handleUpdateEventInfo}
                />
              )}

              {activeTab === 'gallery' && (
                <AdminGalleryTab
                  items={gallery}
                  onAddPhoto={handleAddPhoto}
                  onDeletePhoto={handleDeletePhoto}
                />
              )}

              {activeTab === 'videos' && (
                <AdminVideosTab
                  videos={videos}
                  onAddVideo={handleAddVideo}
                  onDeleteVideo={handleDeleteVideo}
                />
              )}

              {activeTab === 'testimonials' && (
                <AdminTestimonialsTab
                  testimonials={testimonials}
                  onAddTestimonial={handleAddTestimonial}
                  onDeleteTestimonial={handleDeleteTestimonial}
                />
              )}

              {activeTab === 'security' && <AdminSecurityTab />}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
