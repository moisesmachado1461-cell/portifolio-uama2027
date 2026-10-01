import React, { useState } from 'react';
import {
  Palette,
  RotateCcw,
  Save,
  Check,
  Sparkles,
  Sun,
  Moon,
  ArrowRightLeft,
  Info,
} from 'lucide-react';
import { useTheme, THEME_PRESETS, DEFAULT_THEME_CONFIG, DEFAULT_DARK_THEME_CONFIG } from '../../context/ThemeContext.js';
import { ThemeConfig, ThemeMode } from '../../types/index.js';

interface ColorFieldMeta {
  key: keyof ThemeConfig;
  label: string;
  group: 'Principais' | 'Superfícies' | 'Tipografia' | 'Elementos & Botões' | 'Semânticas';
  description: string;
}

const COLOR_FIELDS: ColorFieldMeta[] = [
  // Principais
  { key: 'colorPrimary', label: 'Cor Primária', group: 'Principais', description: 'Usada em destaques e identidade institucional' },
  { key: 'colorSecondary', label: 'Cor Secundária', group: 'Principais', description: 'Usada em subtítulos e ênfases quentes' },
  { key: 'colorAccent', label: 'Cor de Destaque', group: 'Principais', description: 'Dourado/âmbar para citações e ícones especiais' },

  // Superfícies
  { key: 'colorBgMain', label: 'Fundo Principal', group: 'Superfícies', description: 'Cor predominante do site (canvas 60%)' },
  { key: 'colorBgSecondary', label: 'Fundo Secundário', group: 'Superfícies', description: 'Cor de contraste suave para seções alternadas' },
  { key: 'colorCardBg', label: 'Fundo dos Cards', group: 'Superfícies', description: 'Superfície de cartões, formulários e modais' },
  { key: 'colorBorder', label: 'Cor das Bordas Gerais', group: 'Superfícies', description: 'Linhas divisórias e contornos sutis' },
  { key: 'colorCardBorder', label: 'Borda dos Cards', group: 'Superfícies', description: 'Contorno de cartões e blocos estruturais' },

  // Tipografia
  { key: 'colorTextTitle', label: 'Cor dos Títulos', group: 'Tipografia', description: 'Títulos em fonte serifada e cabeçalhos' },
  { key: 'colorTextMain', label: 'Cor do Texto Principal', group: 'Tipografia', description: 'Corpo dos parágrafos e leituras longas' },
  { key: 'colorTextSecondary', label: 'Cor dos Textos Secundários', group: 'Tipografia', description: 'Legendas, metadados e notas' },
  { key: 'colorLink', label: 'Cor dos Links', group: 'Tipografia', description: 'Hiperlinks e chamadas interativas' },

  // Elementos & Botões
  { key: 'colorButtonBg', label: 'Fundo dos Botões', group: 'Elementos & Botões', description: 'Botão principal de ação (Inscreva-se)' },
  { key: 'colorButtonText', label: 'Texto dos Botões', group: 'Elementos & Botões', description: 'Contraste do texto sobre o botão principal' },
  { key: 'colorFormFocus', label: 'Destaque de Formulários', group: 'Elementos & Botões', description: 'Borda ativa ao clicar nos campos' },

  // Semânticas
  { key: 'colorSuccess', label: 'Cor de Sucesso', group: 'Semânticas', description: 'Inscrições confirmadas e feedbacks positivos' },
  { key: 'colorWarning', label: 'Cor de Alerta', group: 'Semânticas', description: 'Avisos e inscrições pendentes' },
  { key: 'colorError', label: 'Cor de Erro', group: 'Semânticas', description: 'Erros de validação e cancelamentos' },
];

export const AdminThemeEditorTab: React.FC = () => {
  const { theme, updateTheme, setThemeMode, applyPreset, resetTheme, saveThemeToServer, isSaving } = useTheme();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('Todas');
  const [presetCategory, setPresetCategory] = useState<'Todos' | 'Claro (Light)' | 'Escuro (Dark)'>('Todos');

  const groups = ['Todas', 'Principais', 'Superfícies', 'Tipografia', 'Elementos & Botões', 'Semânticas'];

  const currentMode: ThemeMode = theme.mode || 'light';

  const handleColorChange = (key: keyof ThemeConfig, val: string) => {
    updateTheme({ [key]: val });
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleSwitchMode = (targetMode: ThemeMode, autoHarmonize: boolean = true) => {
    setThemeMode(targetMode, autoHarmonize);
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleSave = async () => {
    const ok = await saveThemeToServer();
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const filteredFields =
    selectedGroup === 'Todas'
      ? COLOR_FIELDS
      : COLOR_FIELDS.filter((f) => f.group === selectedGroup);

  const filteredPresets =
    presetCategory === 'Todos'
      ? THEME_PRESETS
      : THEME_PRESETS.filter((p) => p.category === presetCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Main Save Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-title)] flex items-center gap-2">
            <Palette className="w-6 h-6 text-[var(--color-primary)]" />
            <span>Identidade Cromática e Tema do Site</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Escolha entre <strong>Tema Claro</strong> ou <strong>Tema Escuro</strong> para o site e personalize livremente todas as cores e paletas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetTheme}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center gap-2 shadow-xs transition-transform active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações do Site'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Selector Card: Tema Claro vs Tema Escuro */}
      <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border-2 border-[var(--color-card-border)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-[var(--color-primary)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Modo Global do Site para Visitantes</span>
            </span>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Defina como todo o público visualizará o site (todos os visitantes receberão o tema configurado aqui).
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-bg-secondary)] self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--color-text-title)]">
              Modo Ativo: <strong>{currentMode === 'dark' ? 'Tema Escuro (Dark)' : 'Tema Claro (Light)'}</strong>
            </span>
          </div>
        </div>

        {/* Big Switch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Option Light */}
          <button
            type="button"
            onClick={() => handleSwitchMode('light', true)}
            className={`p-4 rounded-xl border-2 text-left transition-all relative flex items-start gap-4 ${
              currentMode === 'light'
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xs ring-2 ring-[var(--color-primary)]/20'
                : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 hover:bg-[var(--color-bg-secondary)]'
            }`}
          >
            <div className={`p-3 rounded-xl shrink-0 ${
              currentMode === 'light'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}>
              <Sun className="w-6 h-6" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text-title)]">
                  Tema Claro (Light Mode)
                </span>
                {currentMode === 'light' && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--color-primary)] text-[var(--color-button-text)]">
                    Ativo
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Estilo clássico e luminoso: fundo linho/pergaminho suave, leitura descansada, ideal para transmitir acolhimento e calor diurno.
              </p>
            </div>
          </button>

          {/* Option Dark */}
          <button
            type="button"
            onClick={() => handleSwitchMode('dark', true)}
            className={`p-4 rounded-xl border-2 text-left transition-all relative flex items-start gap-4 ${
              currentMode === 'dark'
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xs ring-2 ring-[var(--color-primary)]/20'
                : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 hover:bg-[var(--color-bg-secondary)]'
            }`}
          >
            <div className={`p-3 rounded-xl shrink-0 ${
              currentMode === 'dark'
                ? 'bg-zinc-800 text-amber-300'
                : 'bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}>
              <Moon className="w-6 h-6" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text-title)]">
                  Tema Escuro (Dark Mode)
                </span>
                {currentMode === 'dark' && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--color-primary)] text-[var(--color-button-text)]">
                    Ativo
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Estilo editorial noturno e imersivo: fundo carvão aquecido, tipografia marfim, contraste refinado e ouro cintilante.
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-[var(--color-text-secondary)]">
          <Info className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
          <span>
            Ao clicar em Tema Claro ou Escuro, uma paleta harmônica otimizada é carregada automaticamente. Você pode selecionar outras paletas abaixo ou ajustar as cores individualmente.
          </span>
        </div>
      </div>

      {/* Preset Palettes Quick Switcher */}
      <div className="p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[var(--color-primary)]">
            <Sparkles className="w-4 h-4" />
            <span>Paletas Pré-configuradas (Harmonias Curadas)</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(['Todos', 'Claro (Light)', 'Escuro (Dark)'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPresetCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  presetCategory === cat
                    ? 'bg-[var(--color-primary)] text-[var(--color-button-text)]'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset.theme)}
              className="p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] text-left space-y-2 bg-[var(--color-bg-secondary)]/30 hover:bg-[var(--color-bg-secondary)] transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--color-text-title)] block truncate">
                  {preset.name}
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--color-bg-main)] text-[var(--color-text-secondary)] border border-[var(--color-border)] shrink-0">
                  {preset.category === 'Escuro (Dark)' ? '🌙 Escuro' : '☀️ Claro'}
                </span>
              </div>

              <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                {preset.description}
              </p>

              <div className="flex items-center gap-1.5 pt-1">
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.theme.colorPrimary }}
                  title="Primária"
                />
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.theme.colorSecondary }}
                  title="Secundária"
                />
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.theme.colorAccent }}
                  title="Destaque"
                />
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.theme.colorBgMain }}
                  title="Fundo Principal"
                />
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: preset.theme.colorCardBg }}
                  title="Fundo dos Cards"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Color Pickers Left, Live Component Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Color Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-primary)]">
              Personalização Fina dos 17 Tokens
            </h4>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {filteredFields.length} campos
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGroup(g)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedGroup === g
                    ? 'bg-[var(--color-primary)] text-[var(--color-button-text)] shadow-xs'
                    : 'bg-[var(--color-card-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-text-title)]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Color Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFields.map((field) => {
              const currentValue = (theme[field.key] as string) || '#000000';

              return (
                <div
                  key={field.key}
                  className="p-3.5 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-2 hover:border-[var(--color-form-focus)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--color-text-title)] truncate block">
                      {field.label}
                    </label>
                    <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">
                      {field.group}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                    {field.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {/* Visual Color Input */}
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/10 shrink-0 shadow-inner">
                      <input
                        type="color"
                        value={currentValue}
                        onChange={(e) => handleColorChange(field.key, e.target.value)}
                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0"
                      />
                    </div>

                    {/* HEX Text Input */}
                    <input
                      type="text"
                      value={currentValue.toUpperCase()}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      maxLength={7}
                      className="flex-1 px-3 py-1.5 font-mono text-xs uppercase rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Component Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="p-4 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--color-primary)]">
                Pré-visualização em Tempo Real
              </h4>
              <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                {currentMode === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Veja como os componentes do site respondem imediatamente às cores configuradas:
            </p>
          </div>

          {/* Interactive Preview Canvas */}
          <div
            className="p-6 rounded-2xl border shadow-sm space-y-5 transition-colors"
            style={{
              backgroundColor: theme.colorBgMain,
              borderColor: theme.colorBorder,
            }}
          >
            {/* Heading & Subtitle Preview */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: theme.colorSecondary }}
                >
                  Retiro Anual UAMA
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor: currentMode === 'dark' ? '#292524' : '#f4efea',
                    color: theme.colorTextSecondary,
                  }}
                >
                  {currentMode === 'dark' ? '🌙 Noite' : '☀️ Dia'}
                </span>
              </div>
              <h3
                className="text-2xl font-serif font-bold tracking-tight"
                style={{ color: theme.colorTextTitle }}
              >
                Mulheres que Florescem
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: theme.colorTextMain }}>
                Exemplo de texto com a paleta em tempo real. Veja o contraste de títulos, cards e botões.
              </p>
            </div>

            {/* Card Preview */}
            <div
              className="p-4 rounded-xl border shadow-2xs space-y-2"
              style={{
                backgroundColor: theme.colorCardBg,
                borderColor: theme.colorCardBorder,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: theme.colorTextTitle }}>
                  Card de Inscrição / Informativo
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{ backgroundColor: `${theme.colorSuccess}20`, color: theme.colorSuccess }}
                >
                  Confirmada
                </span>
              </div>
              <p className="text-xs" style={{ color: theme.colorTextSecondary }}>
                Este card utiliza o fundo de card, borda e texto secundário selecionados.
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs underline font-medium block"
                style={{ color: theme.colorLink }}
              >
                Exemplo de Link Interativo →
              </a>
            </div>

            {/* Form Input Preview */}
            <div className="space-y-1">
              <label
                className="block text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: theme.colorTextTitle }}
              >
                Campo de Formulário
              </label>
              <input
                type="text"
                readOnly
                value="Texto de exemplo no campo"
                className="w-full px-3 py-2 text-xs rounded-lg border"
                style={{
                  backgroundColor: theme.colorCardBg,
                  borderColor: theme.colorFormFocus,
                  color: theme.colorTextMain,
                }}
              />
            </div>

            {/* Buttons Preview */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold shadow-xs transition-opacity hover:opacity-95"
                style={{
                  backgroundColor: theme.colorButtonBg,
                  color: theme.colorButtonText,
                }}
              >
                Botão de Ação Primária (Inscreva-se)
              </button>

              <button
                type="button"
                className="w-full py-2 px-4 rounded-xl text-xs font-medium border"
                style={{
                  backgroundColor: theme.colorCardBg,
                  borderColor: theme.colorBorder,
                  color: theme.colorTextMain,
                }}
              >
                Botão Secundário Neutro
              </button>
            </div>

            {/* Semantic Feedback Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-semibold uppercase">
              <div
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: `${theme.colorSuccess}20`, color: theme.colorSuccess }}
              >
                Sucesso
              </div>
              <div
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: `${theme.colorWarning}20`, color: theme.colorWarning }}
              >
                Alerta
              </div>
              <div
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: `${theme.colorError}20`, color: theme.colorError }}
              >
                Erro
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
