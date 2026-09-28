import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { AboutSection } from './components/AboutSection.js';
import { EventInfoSection } from './components/EventInfoSection.js';
import { ExperienceSection } from './components/ExperienceSection.js';
import { GallerySection } from './components/GallerySection.js';
import { VideosSection } from './components/VideosSection.js';
import { TestimonialsSection } from './components/TestimonialsSection.js';
import { RegistrationForm } from './components/RegistrationForm.js';
import { Footer } from './components/Footer.js';
import { AdminModal } from './components/admin/AdminModal.js';
import { OfficialFlyerModal } from './components/OfficialFlyerModal.js';
import { MobileQuickBar } from './components/MobileQuickBar.js';
import { ResponsivePreviewBar, DeviceMode } from './components/ResponsivePreviewBar.js';
import { PublicData, EventInfo, GalleryItem, VideoItem, TestimonialItem } from './types/index.js';
import { DEFAULT_THEME_CONFIG } from './context/ThemeContext.js';

export default function App() {
  const [publicData, setPublicData] = useState<PublicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [hasAdminToken, setHasAdminToken] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('fluid');
  const [isPreviewBarOpen, setIsPreviewBarOpen] = useState(false);

  const deviceWidthMap: Record<DeviceMode, string> = {
    fluid: 'w-full',
    desktop: 'w-full max-w-[1280px]',
    laptop: 'w-full max-w-[1024px]',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[375px]',
    compact: 'w-full max-w-[320px]',
  };

  useEffect(() => {
    fetchPublicData();
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('uama_admin_token');
    setHasAdminToken(!!token);
  };

  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/public-data');
      if (res.ok) {
        const data: PublicData = await res.json();
        setPublicData(data);
      }
    } catch (e) {
      console.error('Error fetching public data', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !publicData) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-full border-2 border-[#78350F] border-t-transparent animate-spin mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
            Retiro Anual de Mulheres UAMA
          </h2>
          <p className="text-xs text-[#78716C] uppercase tracking-widest font-medium">
            Carregando ambiente de acolhimento...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider initialTheme={publicData.theme || DEFAULT_THEME_CONFIG}>
      <div
        className={`min-h-screen flex flex-col bg-[var(--color-bg-main)] text-[var(--color-text-main)] transition-colors duration-300 ${
          deviceMode !== 'fluid'
            ? 'bg-stone-900/10 dark:bg-black/60 pt-12 pb-16 sm:px-4'
            : ''
        }`}
      >
        {/* Device preview toolbar for testing all resolutions on PC */}
        <ResponsivePreviewBar
          currentMode={deviceMode}
          onChangeMode={(mode) => setDeviceMode(mode)}
          isOpen={isPreviewBarOpen}
          onToggleOpen={() => setIsPreviewBarOpen(!isPreviewBarOpen)}
        />

        {/* Responsive Frame (Fluid by default, or device viewport simulator) */}
        <div
          className={`${deviceWidthMap[deviceMode]} ${
            deviceMode !== 'fluid'
              ? 'mx-auto shadow-2xl rounded-2xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-main)] relative ring-8 ring-stone-950/10'
              : 'w-full'
          } min-h-screen flex flex-col transition-all duration-300`}
        >
          {/* Navigation Bar */}
          <Header
            onOpenAdmin={() => setIsAdminOpen(true)}
            isAdminLoggedIn={hasAdminToken}
          />

          {/* Main Content Sections */}
          <main className="flex-1">
            <Hero
              eventInfo={publicData.eventInfo}
              onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
            />

            <AboutSection />

            <EventInfoSection
              eventInfo={publicData.eventInfo}
              onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
            />

            <ExperienceSection />

            <GallerySection items={publicData.gallery || []} />

            <VideosSection videos={publicData.videos || []} />

            <TestimonialsSection testimonials={publicData.testimonials || []} />

            <RegistrationForm />
          </main>

          {/* Footer */}
          <Footer
            eventInfo={publicData.eventInfo}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* Mobile Bottom Sticky Quick Action Bar */}
          <MobileQuickBar />
        </div>

        {/* Admin Management Modal */}
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => {
            setIsAdminOpen(false);
            checkAdminAuth();
          }}
          eventInfo={publicData.eventInfo}
          gallery={publicData.gallery || []}
          videos={publicData.videos || []}
          testimonials={publicData.testimonials || []}
          onRefreshPublicData={fetchPublicData}
        />

        {/* Official Flyer Modal */}
        <OfficialFlyerModal
          isOpen={isFlyerModalOpen}
          onClose={() => setIsFlyerModalOpen(false)}
          eventInfo={publicData.eventInfo}
          onOpenAdmin={() => {
            setIsFlyerModalOpen(false);
            setIsAdminOpen(true);
          }}
        />
      </div>
    </ThemeProvider>
  );
}
