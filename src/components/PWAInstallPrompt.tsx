import React, { useEffect, useMemo, useState } from 'react';
import { Download, X, Share2 } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  const isIOS = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  useEffect(() => {
    setInstalled(isStandalone());

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;

  // On desktop/Android, only show when the browser confirms the app is installable.
  // On iOS, show the manual Safari instruction because beforeinstallprompt is not supported.
  if (!installEvent && !isIOS) return null;

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setInstalled(true);
    }
    setInstallEvent(null);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:w-[360px] z-[100]">
      <div className="rounded-2xl border border-black/10 bg-white/95 backdrop-blur-xl shadow-2xl p-4 text-stone-900">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#6B1F36] text-white flex items-center justify-center shrink-0 font-bold">
            U
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-bold text-base">Instalar aplicativo UAMA</p>

            {isIOS && !installEvent ? (
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                No Safari, toque em <Share2 className="inline w-4 h-4 mx-0.5" aria-hidden="true" />
                <strong> Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>.
              </p>
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Instale o UAMA na tela inicial e abra como um aplicativo.
              </p>
            )}

            {!isIOS || installEvent ? (
              <button
                type="button"
                onClick={install}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6B1F36] px-4 py-2.5 text-sm font-bold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#6B1F36]/40"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Instalar app
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Fechar aviso de instalação"
            className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-stone-500 hover:bg-stone-100"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
