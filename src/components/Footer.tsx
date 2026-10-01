import React from 'react';
import { Mail, Phone, Heart, Shield } from 'lucide-react';
import { EventInfo } from '../types/index.js';

interface FooterProps {
  eventInfo: EventInfo;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ eventInfo, onOpenAdmin }) => {
  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] py-12 text-[var(--color-text-secondary)] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-6 space-y-3">
            <span className="text-xl font-serif font-bold text-[var(--color-text-title)]">
              Retiro Anual de Mulheres UAMA
            </span>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Uma iniciativa dedicada a acolher, fortalecer e inspirar mulheres em sua caminhada com Deus e em comunidade fraternal.
            </p>
            <p className="font-serif italic text-xs text-[var(--color-text-title)]">
              "{eventInfo.themeVerse || 'Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis.'}" — {eventInfo.themeVerseReference || 'Provérbios 31:10'}
            </p>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Contato & Suporte
            </h4>
            <div className="space-y-1.5">
              <a
                href={`mailto:${eventInfo.contactEmail}`}
                className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{eventInfo.contactEmail}</span>
              </a>
              <a
                href={`https://wa.me/55${eventInfo.contactPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{eventInfo.contactPhone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links & Admin */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Navegação
            </h4>
            <div className="flex flex-col space-y-1.5">
              <a href="#sobre" className="hover:text-[var(--color-primary)] transition-colors">
                Sobre o Retiro
              </a>
              <a href="#informacoes" className="hover:text-[var(--color-primary)] transition-colors">
                Informações do Evento
              </a>
              <a href="#galeria" className="hover:text-[var(--color-primary)] transition-colors">
                Galeria de Fotos
              </a>
              <a href="#inscricao" className="hover:text-[var(--color-primary)] transition-colors">
                Fazer Inscrição
              </a>
              <button
                onClick={onOpenAdmin}
                className="text-left flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors text-[var(--color-primary)] font-medium pt-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Painel da Coordenação</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Retiro de Mulheres UAMA. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com carinho para abençoar vidas
            <Heart className="w-3 h-3 text-[var(--color-secondary)] fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
};
