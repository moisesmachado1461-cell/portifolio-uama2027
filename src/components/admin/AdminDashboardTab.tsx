import React from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Image as ImageIcon,
  Film,
  MessageSquareQuote,
  ArrowUpRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { AdminStats, Registration } from '../../types/index.js';

interface AdminDashboardTabProps {
  stats: AdminStats;
  recentRegistrations: Registration[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  stats,
  recentRegistrations,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-bg-secondary)] to-[var(--color-card-bg)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-title)]">
            Visão Geral da Coordenação
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Acompanhe o andamento das inscrições, mídias e conteúdos do Retiro de Mulheres UAMA em tempo real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="/api/download-project"
            download="retiro-mulheres-uama-codigo-fonte.zip"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-main)] bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Baixar todo o código-fonte e arquivos do site em ZIP"
          >
            <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Baixar Site (.ZIP)</span>
          </a>

          <button
            onClick={() => onNavigateTab('registrations')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center gap-1.5 shadow-2xs"
          >
            <span>Gerenciar Inscrições</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Geral</span>
            <Users className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[var(--color-text-title)] tabular-nums">
            {stats.totalRegistrations}
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Mulheres cadastradas
          </p>
        </div>

        {/* Confirmadas */}
        <div className="p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Confirmadas</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="font-mono text-3xl font-bold text-emerald-800 tabular-nums">
            {stats.confirmedRegistrations}
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Vagas efetivadas
          </p>
        </div>

        {/* Pendentes */}
        <div className="p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold uppercase tracking-wider">Pendentes</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="font-mono text-3xl font-bold text-amber-800 tabular-nums">
            {stats.pendingRegistrations}
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Aguardando contato
          </p>
        </div>

        {/* Canceladas */}
        <div className="p-5 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Canceladas</span>
            <XCircle className="w-4 h-4" />
          </div>
          <p className="font-mono text-3xl font-bold text-stone-700 tabular-nums">
            {stats.cancelledRegistrations}
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Desistências / cancelamentos
          </p>
        </div>
      </div>

      {/* Media Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('gallery')}
          className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-between cursor-pointer hover:border-[var(--color-primary)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-card-bg)] flex items-center justify-center text-[var(--color-primary)]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                Galeria de Fotos
              </p>
              <p className="font-mono text-base font-bold text-[var(--color-text-title)] tabular-nums">
                {stats.totalGallery} fotos ativas
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </div>

        <div
          onClick={() => onNavigateTab('videos')}
          className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-between cursor-pointer hover:border-[var(--color-primary)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-card-bg)] flex items-center justify-center text-[var(--color-primary)]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                Vídeos Publicados
              </p>
              <p className="font-mono text-base font-bold text-[var(--color-text-title)] tabular-nums">
                {stats.totalVideos} vídeos ativos
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </div>

        <div
          onClick={() => onNavigateTab('testimonials')}
          className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-between cursor-pointer hover:border-[var(--color-primary)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-card-bg)] flex items-center justify-center text-[var(--color-primary)]">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                Depoimentos
              </p>
              <p className="font-mono text-base font-bold text-[var(--color-text-title)] tabular-nums">
                {stats.totalTestimonials} relatos ativos
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </div>
      </div>

      {/* Recent Registrations Quick Table */}
      <div className="p-6 rounded-2xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
            Últimas Inscrições Recebidas
          </h4>
          <button
            onClick={() => onNavigateTab('registrations')}
            className="text-xs font-semibold text-[var(--color-link)] hover:underline"
          >
            Ver todas as inscrições →
          </button>
        </div>

        {recentRegistrations.length === 0 ? (
          <p className="text-xs text-[var(--color-text-secondary)] py-4 text-center">
            Nenhuma inscrição registrada ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Protocolo</th>
                  <th className="py-2.5 px-3">Nome</th>
                  <th className="py-2.5 px-3">Telefone</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/50">
                {recentRegistrations.slice(0, 5).map((reg) => (
                  <tr key={reg.id} className="hover:bg-[var(--color-bg-secondary)]/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-[var(--color-primary)]">
                      {reg.protocol}
                    </td>
                    <td className="py-3 px-3 font-medium text-[var(--color-text-title)]">
                      {reg.fullName}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-text-secondary)]">
                      {reg.phone}
                    </td>
                    <td className="py-3 px-3 text-[var(--color-text-secondary)]">
                      {new Date(reg.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          reg.status === 'confirmada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reg.status === 'pendente'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
