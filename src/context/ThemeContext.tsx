import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig, ThemeMode } from '../types/index.js';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'light',
  colorPrimary: '#78350f',
  colorSecondary: '#9a3412',
  colorAccent: '#b8860b',
  colorBgMain: '#faf7f2',
  colorBgSecondary: '#f4efea',
  colorTextTitle: '#1c1917',
  colorTextMain: '#292524',
  colorTextSecondary: '#78716c',
  colorButtonBg: '#78350f',
  colorButtonText: '#ffffff',
  colorLink: '#9a3412',
  colorBorder: '#e7e1d8',
  colorCardBg: '#ffffff',
  colorCardBorder: '#ebe5dc',
  colorFormFocus: '#b8860b',
  colorSuccess: '#166534',
  colorWarning: '#b45309',
  colorError: '#991b1b',
};

export const DEFAULT_DARK_THEME_CONFIG: ThemeConfig = {
  mode: 'dark',
  colorPrimary: '#d97706',
  colorSecondary: '#ea580c',
  colorAccent: '#fbbf24',
  colorBgMain: '#12100e',
  colorBgSecondary: '#1c1917',
  colorTextTitle: '#fef3c7',
  colorTextMain: '#f5f5f4',
  colorTextSecondary: '#a8a29e',
  colorButtonBg: '#d97706',
  colorButtonText: '#1c1917',
  colorLink: '#fbbf24',
  colorBorder: '#2e2824',
  colorCardBg: '#1c1917',
  colorCardBorder: '#38322c',
  colorFormFocus: '#fbbf24',
  colorSuccess: '#22c55e',
  colorWarning: '#f59e0b',
  colorError: '#ef4444',
};

export interface ThemePresetOption {
  name: string;
  category: 'Claro (Light)' | 'Escuro (Dark)';
  description: string;
  theme: ThemeConfig;
}

export const THEME_PRESETS: ThemePresetOption[] = [
  // Presets Claros
  {
    name: 'UAMA Terracota & Ouro (Padrão Claro)',
    category: 'Claro (Light)',
    description: 'Tons de terracota, ouro e linho quente',
    theme: DEFAULT_THEME_CONFIG,
  },
  {
    name: 'Rosa Chá & Sálvia (Claro)',
    category: 'Claro (Light)',
    description: 'Delicadeza botânica com rosa suave e sálvia',
    theme: {
      mode: 'light',
      colorPrimary: '#832729',
      colorSecondary: '#a84e56',
      colorAccent: '#52796f',
      colorBgMain: '#fbf9f8',
      colorBgSecondary: '#f3ece9',
      colorTextTitle: '#241416',
      colorTextMain: '#3d2b2e',
      colorTextSecondary: '#7b6164',
      colorButtonBg: '#832729',
      colorButtonText: '#ffffff',
      colorLink: '#a84e56',
      colorBorder: '#ebdcd9',
      colorCardBg: '#ffffff',
      colorCardBorder: '#f0e3e0',
      colorFormFocus: '#a84e56',
      colorSuccess: '#2d6a4f',
      colorWarning: '#b07d08',
      colorError: '#9a1a24',
    },
  },
  {
    name: 'Bordô Imperial & Linho (Claro)',
    category: 'Claro (Light)',
    description: 'Nobreza clássica com bordô profundo e toques dourados',
    theme: {
      mode: 'light',
      colorPrimary: '#54122b',
      colorSecondary: '#7f1d42',
      colorAccent: '#c59b27',
      colorBgMain: '#fcfaf8',
      colorBgSecondary: '#f5eee8',
      colorTextTitle: '#1f0810',
      colorTextMain: '#2e1921',
      colorTextSecondary: '#6e545e',
      colorButtonBg: '#54122b',
      colorButtonText: '#ffffff',
      colorLink: '#7f1d42',
      colorBorder: '#e8dbd7',
      colorCardBg: '#ffffff',
      colorCardBorder: '#ede2de',
      colorFormFocus: '#c59b27',
      colorSuccess: '#1e5e3a',
      colorWarning: '#b26500',
      colorError: '#8f141f',
    },
  },
  {
    name: 'Lavanda Silvestre & Oliva (Claro)',
    category: 'Claro (Light)',
    description: 'Tranquilidade e introspecção com lavanda serena',
    theme: {
      mode: 'light',
      colorPrimary: '#4a3f6b',
      colorSecondary: '#635380',
      colorAccent: '#7b8c5e',
      colorBgMain: '#faf9fc',
      colorBgSecondary: '#f0edf5',
      colorTextTitle: '#1b152b',
      colorTextMain: '#2d253d',
      colorTextSecondary: '#685d7d',
      colorButtonBg: '#4a3f6b',
      colorButtonText: '#ffffff',
      colorLink: '#635380',
      colorBorder: '#e1dce8',
      colorCardBg: '#ffffff',
      colorCardBorder: '#e9e4f0',
      colorFormFocus: '#7b8c5e',
      colorSuccess: '#2b6e4f',
      colorWarning: '#b06f15',
      colorError: '#8e1b29',
    },
  },

  // Presets Escuros (Dark)
  {
    name: 'UAMA Noite Estrelada & Ouro (Padrão Escuro)',
    category: 'Escuro (Dark)',
    description: 'Imersão noturna acolhedora com fundo carvão e âmbar dourado',
    theme: DEFAULT_DARK_THEME_CONFIG,
  },
  {
    name: 'Bordô Noturno & Rosé (Escuro)',
    category: 'Escuro (Dark)',
    description: 'Bordô aveludado, sombras rosadas e detalhes luminosos',
    theme: {
      mode: 'dark',
      colorPrimary: '#fb7185',
      colorSecondary: '#f43f5e',
      colorAccent: '#fbbf24',
      colorBgMain: '#140c10',
      colorBgSecondary: '#1f1319',
      colorTextTitle: '#ffe4e6',
      colorTextMain: '#fde8ef',
      colorTextSecondary: '#b894a4',
      colorButtonBg: '#e11d48',
      colorButtonText: '#ffffff',
      colorLink: '#fb7185',
      colorBorder: '#361e2b',
      colorCardBg: '#1e1218',
      colorCardBorder: '#422436',
      colorFormFocus: '#fb7185',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#f43f5e',
    },
  },
  {
    name: 'Sálvia & Esmeralda Noturna (Escuro)',
    category: 'Escuro (Dark)',
    description: 'Refúgio na floresta com tons verdes profundos e calma zen',
    theme: {
      mode: 'dark',
      colorPrimary: '#34d399',
      colorSecondary: '#10b981',
      colorAccent: '#6ee7b7',
      colorBgMain: '#0c1512',
      colorBgSecondary: '#13211c',
      colorTextTitle: '#ecfdf5',
      colorTextMain: '#e1f5ec',
      colorTextSecondary: '#8baea1',
      colorButtonBg: '#059669',
      colorButtonText: '#ffffff',
      colorLink: '#34d399',
      colorBorder: '#1e382f',
      colorCardBg: '#152520',
      colorCardBorder: '#27473b',
      colorFormFocus: '#34d399',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#f87171',
    },
  },
  {
    name: 'Ametista Silenciosa (Escuro)',
    category: 'Escuro (Dark)',
    description: 'Roxo nobre e místico para noites de louvor e reflexão',
    theme: {
      mode: 'dark',
      colorPrimary: '#c084fc',
      colorSecondary: '#a855f7',
      colorAccent: '#e9d5ff',
      colorBgMain: '#110c1c',
      colorBgSecondary: '#1b142c',
      colorTextTitle: '#f5f3ff',
      colorTextMain: '#ede9fe',
      colorTextSecondary: '#a99fc5',
      colorButtonBg: '#9333ea',
      colorButtonText: '#ffffff',
      colorLink: '#c084fc',
      colorBorder: '#31244e',
      colorCardBg: '#1a1329',
      colorCardBorder: '#3e2e63',
      colorFormFocus: '#c084fc',
      colorSuccess: '#22c55e',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
    },
  },
];

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  setThemeMode: (mode: ThemeMode, autoHarmonize?: boolean) => void;
  applyPreset: (presetTheme: ThemeConfig) => void;
  resetTheme: () => Promise<void>;
  saveThemeToServer: () => Promise<boolean>;
  isSaving: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  initialTheme?: ThemeConfig;
  children: React.ReactNode;
}> = ({ initialTheme, children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    if (initialTheme) {
      return {
        ...DEFAULT_THEME_CONFIG,
        ...initialTheme,
        mode: initialTheme.mode || 'light',
      };
    }
    return DEFAULT_THEME_CONFIG;
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialTheme) {
      setTheme({
        ...DEFAULT_THEME_CONFIG,
        ...initialTheme,
        mode: initialTheme.mode || 'light',
      });
    }
  }, [initialTheme]);

  useEffect(() => {
    // Apply CSS Variables to Document Root
    const root = document.documentElement;

    // Apply dark class and data attribute
    if (theme.mode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme-mode', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme-mode', 'light');
    }

    root.style.setProperty('--color-primary', theme.colorPrimary);
    root.style.setProperty('--color-secondary', theme.colorSecondary);
    root.style.setProperty('--color-accent', theme.colorAccent);
    root.style.setProperty('--color-bg-main', theme.colorBgMain);
    root.style.setProperty('--color-bg-secondary', theme.colorBgSecondary);
    root.style.setProperty('--color-text-title', theme.colorTextTitle);
    root.style.setProperty('--color-text-main', theme.colorTextMain);
    root.style.setProperty('--color-text-secondary', theme.colorTextSecondary);
    root.style.setProperty('--color-button-bg', theme.colorButtonBg);
    root.style.setProperty('--color-button-text', theme.colorButtonText);
    root.style.setProperty('--color-link', theme.colorLink);
    root.style.setProperty('--color-border', theme.colorBorder);
    root.style.setProperty('--color-card-bg', theme.colorCardBg);
    root.style.setProperty('--color-card-border', theme.colorCardBorder);
    root.style.setProperty('--color-form-focus', theme.colorFormFocus);
    root.style.setProperty('--color-success', theme.colorSuccess);
    root.style.setProperty('--color-warning', theme.colorWarning);
    root.style.setProperty('--color-error', theme.colorError);
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const setThemeMode = (mode: ThemeMode, autoHarmonize: boolean = true) => {
    if (theme.mode === mode) return;

    if (autoHarmonize) {
      // Pick matching base palette
      const targetPreset = mode === 'dark' ? DEFAULT_DARK_THEME_CONFIG : DEFAULT_THEME_CONFIG;
      setTheme(targetPreset);
    } else {
      setTheme(prev => ({ ...prev, mode }));
    }
  };

  const applyPreset = (presetTheme: ThemeConfig) => {
    setTheme(presetTheme);
  };

  const resetTheme = async () => {
    setTheme(DEFAULT_THEME_CONFIG);
    const token = localStorage.getItem('uama_admin_token');
    if (token) {
      try {
        await fetch('/api/admin/theme/reset', {
          method: 'POST',
          credentials: 'same-origin',
        });
      } catch (e) {
        console.error('Error resetting theme on server', e);
      }
    }
  };

  const saveThemeToServer = async (): Promise<boolean> => {
    const token = localStorage.getItem('uama_admin_token');
    if (!token) return false;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      setIsSaving(false);
      return res.ok;
    } catch (e) {
      setIsSaving(false);
      console.error('Error saving theme', e);
      return false;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        setThemeMode,
        applyPreset,
        resetTheme,
        saveThemeToServer,
        isSaving,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
