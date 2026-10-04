import React from 'react';
import { Calendar, MapPin, DollarSign, Utensils, BedDouble, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { EventInfo } from '../types/index.js';

interface EventInfoSectionProps {
  eventInfo: EventInfo;
  onOpenFlyerModal?: () => void;
}

export const EventInfoSection: React.FC<EventInfoSectionProps> = ({ eventInfo, onOpenFlyerModal }) => {
  return (
    <section id="informacoes" className="py-20 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Detalhes do Evento
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            Tudo o que você precisa saber
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Consulte as principais diretrizes do retiro. Os dados específicos de dias, local e valores serão publicados oficialmente assim que o cartaz definitivo for emitido pela coordenação.
          </p>
        </div>

        {/* Official Status Notice Banner */}
        <div className="mb-12 p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)] shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-title)]">
                Status dos Dados do Retiro
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                {eventInfo.importantNotice}
              </p>
            </div>
          </div>

          {eventInfo.officialFlyerUrl && (
            <button
              onClick={onOpenFlyerModal}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Cartaz Oficial</span>
            </button>
          )}
        </div>

        {/* 4 Core Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Data & Duração */}
          <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)]">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
              Data & Duração
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm text-[var(--color-text-main)]">
              <p className="font-semibold text-[var(--color-primary)]">
                {eventInfo.month} · {eventInfo.duration}
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {eventInfo.isDateConfirmed
                  ? eventInfo.datesText
                  : 'Aguardando publicação do cartaz oficial com os dias exatos.'}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              Check-in na sexta à tarde e encerramento no domingo após o almoço.
            </div>
          </div>

          {/* Card 2: Local & Acomodações */}
          <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
              Localização
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm text-[var(--color-text-main)]">
              <p className="font-semibold text-[var(--color-primary)]">
                {eventInfo.locationName}
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {eventInfo.isLocationConfirmed
                  ? eventInfo.locationAddress
                  : 'Endereço e rota de acesso serão divulgados no anúncio oficial.'}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              Espaço seguro com ampla área verde, salão nobre e estacionamento.
            </div>
          </div>

          {/* Card 3: Investimento & Pagamento */}
          <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)]">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
              Investimento
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm text-[var(--color-text-main)]">
              <p className="font-semibold text-[var(--color-primary)]">
                {eventInfo.isInvestmentConfirmed
                  ? eventInfo.investmentText
                  : 'Valores a confirmar no cartaz oficial'}
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Formas aceitas: {eventInfo.paymentMethods}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              Pré-inscrição gratuita garante prioridade na escolha de quartos.
            </div>
          </div>

          {/* Card 4: Hospedagem */}
          <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)]">
              <BedDouble className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
              Hospedagem Inclusa
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {eventInfo.lodgingInfo}
            </p>
            <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              Opções de quartos compartilhados por famílias, amigas ou duplas.
            </div>
          </div>

          {/* Card 5: Alimentação */}
          <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)]">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
              Alimentação Completa
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {eventInfo.mealsInfo}
            </p>
            <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              Cardápio balanceado com opções para restrições alimentares informadas na inscrição.
            </div>
          </div>

          {/* Card 6: O Que Levar */}
          <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-primary)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[var(--color-text-title)]">
              Orientações da Mala
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Bíblia, caderno de anotações, garrafa de água, roupas leves e confortáveis, agasalho para as noites frescas e remédios de uso contínuo.
            </p>
            <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              Kit de boas-vindas com crachá e caderno temático entregue no check-in.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
