import React from 'react';
import { X, Download, FileText, Info } from 'lucide-react';
import { EventInfo } from '../types/index.js';

interface OfficialFlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventInfo: EventInfo;
}

export const OfficialFlyerModal: React.FC<OfficialFlyerModalProps> = ({
  isOpen,
  onClose,
  eventInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-base font-serif font-bold text-[var(--color-text-title)]">
              Cartaz Oficial do Retiro UAMA
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-card-bg)] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center">
          {eventInfo.officialFlyerUrl ? (
            <div className="space-y-4 max-w-full">
              <img
                src={eventInfo.officialFlyerUrl}
                alt="Cartaz Oficial do Retiro Anual de Mulheres UAMA"
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md border border-[var(--color-border)] mx-auto"
              />
              <div className="flex justify-center gap-3">
                <a
                  href={eventInfo.officialFlyerUrl}
                  download="Cartaz_Retiro_Mulheres_UAMA.jpg"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Imagem do Cartaz</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-12 px-4 max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-secondary)] text-[var(--color-primary)] mx-auto flex items-center justify-center border border-[var(--color-border)]">
                <Info className="w-7 h-7 text-[var(--color-accent)]" />
              </div>
              <h4 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
                Cartaz Oficial em Produção
              </h4>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                As datas específicas, o local exato e o valor de investimento serão publicados assim que a imagem oficial for recebida e anexada pela coordenação.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
