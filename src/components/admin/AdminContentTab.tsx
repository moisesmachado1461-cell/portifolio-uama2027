import React, { useState } from 'react';
import { Save, Check, Upload, Image as ImageIcon, AlertCircle, Plus, Trash2, Clock } from 'lucide-react';
import { EventInfo } from '../../types/index.js';

interface AdminContentTabProps {
  eventInfo: EventInfo;
  onUpdateEventInfo: (newInfo: Partial<EventInfo>) => Promise<boolean>;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({
  eventInfo,
  onUpdateEventInfo,
}) => {
  const [formData, setFormData] = useState<EventInfo>(eventInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field: keyof EventInfo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFlyerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleInputChange('officialFlyerUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...(formData.scheduleHighlights || [])];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    handleInputChange('scheduleHighlights', newSchedule);
  };

  const addScheduleItem = () => {
    const newSchedule = [
      ...(formData.scheduleHighlights || []),
      { day: 'Sábado', time: '14:00 às 16:00', activity: 'Nova Atividade Programada' },
    ];
    handleInputChange('scheduleHighlights', newSchedule);
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = [...(formData.scheduleHighlights || [])];
    newSchedule.splice(index, 1);
    handleInputChange('scheduleHighlights', newSchedule);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await onUpdateEventInfo(formData);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-title)]">
            Gerenciamento de Conteúdo & Informações
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Atualize dados do retiro, textos da página inicial e anexe o cartaz oficial assim que disponível.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center gap-2 shadow-xs transition-transform active:scale-95"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Salvo com Sucesso!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </>
          )}
        </button>
      </div>

      {/* Cartaz Oficial Upload Section */}
      <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
              Cartaz Oficial do Retiro (Imagem do Informativo)
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Faça o upload da imagem do cartaz oficial ou cole uma URL direta quando recebê-lo.
            </p>
          </div>
          {formData.officialFlyerUrl && (
            <button
              type="button"
              onClick={() => handleInputChange('officialFlyerUrl', '')}
              className="text-xs text-red-600 hover:underline"
            >
              Remover cartaz
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4">
            {formData.officialFlyerUrl ? (
              <div className="rounded-xl overflow-hidden border border-[var(--color-border)] max-h-48 aspect-3/4 bg-stone-100 flex items-center justify-center">
                <img
                  src={formData.officialFlyerUrl}
                  alt="Cartaz do Retiro"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-[var(--color-border)] p-6 text-center text-xs text-[var(--color-text-secondary)] space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto opacity-50 text-[var(--color-text-secondary)]" />
                <p>Nenhum cartaz anexado ainda</p>
              </div>
            )}
          </div>

          <div className="md:col-span-8 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-title)] mb-1">
                Upload do Arquivo do Cartaz (PNG, JPG)
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-main)] cursor-pointer">
                <Upload className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Escolher Imagem do Computador</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFlyerFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-title)] mb-1">
                Ou informe a URL da Imagem
              </label>
              <input
                type="url"
                value={formData.officialFlyerUrl || ''}
                onChange={(e) => handleInputChange('officialFlyerUrl', e.target.value)}
                placeholder="https://exemplo.com/cartaz.jpg"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Basic Event Info Fields */}
      <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs space-y-4">
        <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
          Informações Principais & Mensagem Espiritual
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Nome do Retiro
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Mês & Duração
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                placeholder="Setembro"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
              />
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="3 dias"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
              />
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Subtítulo Inspirador (Hero)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Versículo Bíblico Temático
            </label>
            <input
              type="text"
              value={formData.themeVerse}
              onChange={(e) => handleInputChange('themeVerse', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Referência do Versículo
            </label>
            <input
              type="text"
              value={formData.themeVerseReference}
              onChange={(e) => handleInputChange('themeVerseReference', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Aviso Geral sobre Dados do Retiro
            </label>
            <textarea
              rows={2}
              value={formData.importantNotice}
              onChange={(e) => handleInputChange('importantNotice', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>
        </div>
      </div>

      {/* Confirmation Flags: Datas, Local, Valores */}
      <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs space-y-6">
        <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
          Confirmação de Dados Específicos
        </h4>

        {/* Datas */}
        <div className="space-y-2 p-4 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDateConfirmed"
              checked={formData.isDateConfirmed}
              onChange={(e) => handleInputChange('isDateConfirmed', e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="isDateConfirmed" className="text-xs font-semibold text-[var(--color-text-title)] cursor-pointer">
              Datas exatas já confirmadas pelo cartaz oficial?
            </label>
          </div>
          <input
            type="text"
            value={formData.datesText}
            onChange={(e) => handleInputChange('datesText', e.target.value)}
            placeholder="Ex: 18 a 20 de Setembro de 2026"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
          />
        </div>

        {/* Local */}
        <div className="space-y-2 p-4 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isLocationConfirmed"
              checked={formData.isLocationConfirmed}
              onChange={(e) => handleInputChange('isLocationConfirmed', e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="isLocationConfirmed" className="text-xs font-semibold text-[var(--color-text-title)] cursor-pointer">
              Local definitivo confirmado?
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => handleInputChange('locationName', e.target.value)}
              placeholder="Nome do local (Ex: Recanto das Águas Claras)"
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
            <input
              type="text"
              value={formData.locationAddress}
              onChange={(e) => handleInputChange('locationAddress', e.target.value)}
              placeholder="Endereço / Cidade (Ex: Serra Negra - SP)"
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>
        </div>

        {/* Investimento */}
        <div className="space-y-2 p-4 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isInvestmentConfirmed"
              checked={formData.isInvestmentConfirmed}
              onChange={(e) => handleInputChange('isInvestmentConfirmed', e.target.checked)}
              className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="isInvestmentConfirmed" className="text-xs font-semibold text-[var(--color-text-title)] cursor-pointer">
              Valores e condições definitivas confirmadas?
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={formData.investmentText}
              onChange={(e) => handleInputChange('investmentText', e.target.value)}
              placeholder="Ex: R$ 480,00 por participante (Tudo incluso)"
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
            <input
              type="text"
              value={formData.paymentMethods}
              onChange={(e) => handleInputChange('paymentMethods', e.target.value)}
              placeholder="Ex: PIX, Cartão até 6x sem juros"
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>
        </div>
      </div>

      {/* Hospedagem & Alimentação Textos */}
      <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs space-y-4">
        <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
          Hospedagem & Alimentação
        </h4>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Detalhes da Hospedagem
            </label>
            <textarea
              rows={2}
              value={formData.lodgingInfo}
              onChange={(e) => handleInputChange('lodgingInfo', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
              Detalhes da Alimentação
            </label>
            <textarea
              rows={2}
              value={formData.mealsInfo}
              onChange={(e) => handleInputChange('mealsInfo', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
            />
          </div>
        </div>
      </div>

      {/* Schedule Highlights */}
      <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
              Programação dos 3 Dias
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Edite ou adicione momentos de atividades para os dias do retiro.
            </p>
          </div>
          <button
            type="button"
            onClick={addScheduleItem}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Momento</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {(formData.scheduleHighlights || []).map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 sm:p-2 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-2">
                <select
                  value={item.day}
                  onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                  className="text-xs p-2 sm:p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] shrink-0"
                >
                  <option value="Sexta-feira">Sexta-feira</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>

                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                  placeholder="08:00 às 09:30"
                  className="flex-1 sm:w-36 text-xs p-2 sm:p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />

                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="sm:hidden p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded shrink-0 min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={item.activity}
                  onChange={(e) => handleScheduleChange(index, 'activity', e.target.value)}
                  placeholder="Descrição da atividade..."
                  className="flex-1 text-xs p-2 sm:p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)]"
                />

                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="hidden sm:flex p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
