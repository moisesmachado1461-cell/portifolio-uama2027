import React from 'react';
import { Monitor, Tablet, Smartphone, Maximize2, Laptop } from 'lucide-react';

export type DeviceMode = 'fluid' | 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'compact';

interface ResponsivePreviewBarProps {
  currentMode: DeviceMode;
  onChangeMode: (mode: DeviceMode) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const ResponsivePreviewBar: React.FC<ResponsivePreviewBarProps> = ({
  currentMode,
  onChangeMode,
  isOpen,
  onToggleOpen,
}) => {
  const devices = [
    { id: 'fluid', label: '100% Fluido', width: '100%', icon: Maximize2, desc: 'Tela Real' },
    { id: 'desktop', label: 'PC / Desktop', width: '1280px', icon: Monitor, desc: '1280px' },
    { id: 'laptop', label: 'Notebook', width: '1024px', icon: Laptop, desc: '1024px' },
    { id: 'tablet', label: 'Tablet / iPad', width: '768px', icon: Tablet, desc: '768px' },
    { id: 'mobile', label: 'Smartphone', width: '375px', icon: Smartphone, desc: '375px' },
    { id: 'compact', label: 'Celular Pequeno', width: '320px', icon: Smartphone, desc: '320px' },
  ];

  if (!isOpen) {
    return (
      <div className="fixed top-20 right-3 z-30 hidden sm:block">
        <button
          onClick={onToggleOpen}
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-stone-900/90 text-amber-200 border border-amber-500/30 shadow-lg hover:bg-stone-900 transition-all flex items-center gap-1.5 backdrop-blur-md active:scale-95"
          title="Abrir Simulador de Dispositivos (PC, Tablet, Celular)"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulador Multi-Dispositivo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-stone-950/95 text-stone-100 border-b border-stone-800 shadow-xl backdrop-blur-md px-3 py-2 flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
        <span className="font-semibold text-stone-200 hidden md:inline">
          Modo Multi-Dispositivo:
        </span>
        <span className="text-[11px] text-stone-400">
          Teste a responsividade em tempo real
        </span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {devices.map((dev) => {
          const Icon = dev.icon;
          const isActive = currentMode === dev.id;
          return (
            <button
              key={dev.id}
              onClick={() => onChangeMode(dev.id as DeviceMode)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{dev.label}</span>
              <span className="text-[9px] opacity-75 hidden lg:inline">({dev.desc})</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onToggleOpen}
        className="text-[11px] text-stone-400 hover:text-white px-2 py-1 rounded bg-stone-900 hover:bg-stone-800 ml-2 shrink-0"
      >
        Ocultar
      </button>
    </div>
  );
};
