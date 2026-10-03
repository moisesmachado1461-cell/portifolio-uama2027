import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  MessageCircle,
  AlertTriangle,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Copy,
} from 'lucide-react';
import { Registration } from '../../types/index.js';

interface AdminRegistrationsTabProps {
  registrations: Registration[];
  onUpdateStatus: (
    id: string,
    newStatus: 'pendente' | 'confirmada' | 'cancelada'
  ) => Promise<void>;
  onDeleteRegistration: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const AdminRegistrationsTab: React.FC<AdminRegistrationsTabProps> = ({
  registrations,
  onUpdateStatus,
  onDeleteRegistration,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const maskCpf = (cpf?: string) => {
    const digits = (cpf || '').replace(/\D/g, '');
    if (digits.length !== 11) return '***.***.***-**';
    return `***.***.***-${digits.slice(-2)}`;
  };

  const maskRg = (rg?: string) => {
    const value = (rg || '').trim();
    if (!value) return 'Não informado';
    return `${'*'.repeat(Math.max(5, value.length - 3))}${value.slice(-3)}`;
  };

  const maskAddress = (address?: string) => {
    if (!address) return 'Não informado';
    const first = address.split(',')[0]?.trim();
    return first ? `${first}, ••••••` : '••••••';
  };

  // Formata a data de nascimento sem problemas de fuso horário
  const formatBirthDate = (birthDate?: string) => {
    if (!birthDate) return 'Não informado';

    const parts = birthDate.split('-');

    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return birthDate;
  };

  // Calcula a idade
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;

    const parts = birthDate.split('-');

    if (parts.length !== 3) return null;

    const birthYear = Number(parts[0]);
    const birthMonth = Number(parts[1]);
    const birthDay = Number(parts[2]);

    const today = new Date();

    let age = today.getFullYear() - birthYear;

    const birthdayHasNotHappened =
      today.getMonth() + 1 < birthMonth ||
      (today.getMonth() + 1 === birthMonth &&
        today.getDate() < birthDay);

    if (birthdayHasNotHappened) {
      age--;
    }

    return age;
  };

  const filtered = registrations
    .filter((reg) => {
      const matchesStatus =
        statusFilter === 'todos' || reg.status === statusFilter;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        reg.fullName.toLowerCase().includes(term) ||
        reg.cpf.includes(term) ||
        reg.phone.includes(term) ||
        reg.protocol.toLowerCase().includes(term) ||
        reg.shirtSize?.toLowerCase().includes(term) ||
        reg.slipperSize?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName, 'pt-BR');
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === 'oldest' ? aTime - bTime : bTime - aTime;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginated = filtered.slice(pageStart, pageStart + pageSize);

  const totals = {
    total: registrations.length,
    confirmed: registrations.filter((r) => r.status === 'confirmada').length,
    pending: registrations.filter((r) => r.status === 'pendente').length,
    cancelled: registrations.filter((r) => r.status === 'cancelada').length,
  };

  const changeSearch = (value: string) => { setSearchTerm(value); setCurrentPage(1); };
  const changeStatus = (value: string) => { setStatusFilter(value); setCurrentPage(1); };
  const changeSort = (value: 'newest' | 'oldest' | 'name') => { setSortBy(value); setCurrentPage(1); };

  const copyText = async (value: string) => {
    try { await navigator.clipboard.writeText(value); } catch { /* sem bloqueio da operação */ }
  };

  // Exportar CSV
  const handleExportCSV = () => {
    const confirmed = window.confirm('O CSV contém dados pessoais completos (CPF, RG, endereço e telefone). Exporte apenas quando necessário e mantenha o arquivo protegido.');
    if (!confirmed) return;

    const headers = [
      'Protocolo',
      'Nome Completo',
      'Data de Nascimento',
      'Idade',
      'Telefone',
      'Endereço',
      'RG',
      'CPF',
      'Número do Chinelo',
      'Tamanho da Camisa',
      'Ciente da Não Devolução',
      'Status',
      'Data da Inscrição',
    ];

    const rows = filtered.map((r) => [
      `"${r.protocol}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${formatBirthDate(r.birthDate)}"`,
      `"${calculateAge(r.birthDate) ?? 'Não informado'}"`,
      `"${r.phone}"`,
      `"${r.address.replace(/"/g, '""')}"`,
      `"${r.rg}"`,
      `"${r.cpf}"`,
      `"${r.slipperSize}"`,
      `"${r.shirtSize || 'Não informado'}"`,
      `"${r.acknowledgement ? 'Sim' : 'Não'}"`,
      `"${r.status}"`,
      `"${new Date(r.createdAt).toLocaleString('pt-BR')}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Inscricoes_Retiro_Mulheres_UAMA_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Excluir inscrição
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    await onDeleteRegistration(deleteTarget.id);

    setIsDeleting(false);
    setDeleteTarget(null);
  };

  // Abrir WhatsApp
  const handleWhatsAppContact = (reg: Registration) => {
    const cleanPhone = reg.phone.replace(/\D/g, '');

    const message = encodeURIComponent(
      `Olá ${reg.fullName.split(' ')[0]}! Aqui é da coordenação do Retiro de Mulheres UAMA. Estamos entrando em contato a respeito da sua inscrição (${reg.protocol}).`
    );

    window.open(
      `https://wa.me/55${cleanPhone}?text=${message}`,
      '_blank'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Resumo operacional */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Total', totals.total, 'todos'],
          ['Confirmadas', totals.confirmed, 'confirmada'],
          ['Pendentes', totals.pending, 'pendente'],
          ['Canceladas', totals.cancelled, 'cancelada'],
        ].map(([label, value, filter]) => (
          <button
            key={String(label)}
            onClick={() => changeStatus(String(filter))}
            className={`text-left p-4 rounded-2xl border transition-colors ${statusFilter === filter ? 'border-[var(--color-primary)] bg-[var(--color-bg-secondary)]' : 'border-[var(--color-card-border)] bg-[var(--color-card-bg)]'}`}
          >
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)]">{label}</span>
            <strong className="block mt-1 text-2xl font-mono text-[var(--color-text-title)]">{value}</strong>
          </button>
        ))}
      </div>

      {/* Barra superior */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF, telefone, protocolo, camisa ou chinelo..."
            value={searchTerm}
            onChange={(e) => changeSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] text-xs sm:text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            <select value={statusFilter} onChange={(e) => changeStatus(e.target.value)} className="text-xs bg-transparent text-[var(--color-text-main)] focus:outline-hidden cursor-pointer">
              <option value="todos">Todos os status</option>
              <option value="confirmada">Confirmadas</option>
              <option value="pendente">Pendentes</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => changeSort(e.target.value as 'newest' | 'oldest' | 'name')}
            className="text-xs bg-[var(--color-card-bg)] text-[var(--color-text-main)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 focus:outline-hidden cursor-pointer"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="name">Nome A–Z</option>
          </select>

          <button onClick={handleExportCSV} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-main)] bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center gap-2 shadow-2xs whitespace-nowrap">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar filtrados</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
        <span>{filtered.length} resultado(s) encontrado(s)</span>
        {filtered.length > 0 && <span>Exibindo {pageStart + 1}–{Math.min(pageStart + pageSize, filtered.length)}</span>}
      </div>

      {/* Tabela */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl shadow-xs overflow-hidden">

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">

            <FileSpreadsheet className="w-10 h-10 text-[var(--color-text-secondary)] mx-auto opacity-50" />

            <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
              Nenhuma inscrição encontrada
            </h4>

            <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
              Nenhum registro corresponde aos filtros ou ao termo de busca informado.
            </p>

          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead>
                  <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider">

                    <th className="py-3 px-4">
                      Protocolo
                    </th>

                    <th className="py-3 px-4">
                      Nome Completo
                    </th>

                    <th className="py-3 px-4">
                      Nascimento
                    </th>

                    <th className="py-3 px-4">
                      CPF
                    </th>

                    <th className="py-3 px-4">
                      Telefone
                    </th>

                    <th className="py-3 px-4">Kit</th>

                    <th className="py-3 px-4">
                      Status
                    </th>

                    <th className="py-3 px-4 text-right">
                      Ações
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--color-border)]/50">

                  {paginated.map((reg) => (

                    <tr
                      key={reg.id}
                      className="hover:bg-[var(--color-bg-secondary)]/30 transition-colors"
                    >

                      <td className="py-3 px-4 font-mono font-medium text-[var(--color-primary)]">
                        {reg.protocol}
                      </td>

                      <td className="py-3 px-4 font-semibold text-[var(--color-text-title)]">
                        {reg.fullName}
                      </td>

                      <td className="py-3 px-4 text-[var(--color-text-main)]">
                        <div>
                          <span className="block">
                            {formatBirthDate(reg.birthDate)}
                          </span>

                          {calculateAge(reg.birthDate) !== null && (
                            <span className="text-[10px] text-[var(--color-text-secondary)]">
                              {calculateAge(reg.birthDate)} anos
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[var(--color-text-main)]">
                        {maskCpf(reg.cpf)}
                      </td>

                      <td className="py-3 px-4 text-[var(--color-text-main)]">

                        <div className="flex items-center gap-1.5">

                          <span>
                            {reg.phone}
                          </span>

                          <button
                            onClick={() => handleWhatsAppContact(reg)}
                            className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Enviar mensagem no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                        </div>

                      </td>

                      <td className="py-3 px-4 text-[var(--color-text-main)]">
                        <span className="block">Camisa: <strong>{reg.shirtSize || '—'}</strong></span>
                        <span className="block text-[10px] text-[var(--color-text-secondary)]">Chinelo: {reg.slipperSize || '—'}</span>
                      </td>

                      <td className="py-3 px-4">

                        <select
                          value={reg.status}
                          onChange={(e) =>
                            onUpdateStatus(
                              reg.id,
                              e.target.value as
                                | 'pendente'
                                | 'confirmada'
                                | 'cancelada'
                            )
                          }
                          className={`text-[11px] font-semibold uppercase tracking-wider rounded-lg px-2 py-1 border cursor-pointer focus:outline-hidden ${
                            reg.status === 'confirmada'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : reg.status === 'pendente'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >

                          <option value="pendente">
                            Pendente
                          </option>

                          <option value="confirmada">
                            Confirmada
                          </option>

                          <option value="cancelada">
                            Cancelada
                          </option>

                        </select>

                      </td>

                      <td className="py-3 px-4 text-right">

                        <div className="flex items-center justify-end gap-1">

                          <button
                            onClick={() => { setShowSensitiveData(false); setSelectedReg(reg); }}
                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] hover:bg-[var(--color-bg-secondary)] rounded-lg"
                            title="Ver detalhes completos"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(reg)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Excluir inscrição"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile */}
            <div className="block md:hidden divide-y divide-[var(--color-border)]/60">

              {paginated.map((reg) => (

                <div
                  key={reg.id}
                  className="p-4 space-y-3 bg-[var(--color-card-bg)] hover:bg-[var(--color-bg-secondary)]/20 transition-colors"
                >

                  <div className="flex items-start justify-between gap-2">

                    <div>

                      <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
                        {reg.protocol}
                      </span>

                      <h5 className="font-semibold text-sm text-[var(--color-text-title)] mt-0.5">
                        {reg.fullName}
                      </h5>

                    </div>

                    <select
                      value={reg.status}
                      onChange={(e) =>
                        onUpdateStatus(
                          reg.id,
                          e.target.value as
                            | 'pendente'
                            | 'confirmada'
                            | 'cancelada'
                        )
                      }
                      className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 border cursor-pointer shrink-0 ${
                        reg.status === 'confirmada'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : reg.status === 'pendente'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >

                      <option value="pendente">
                        Pendente
                      </option>

                      <option value="confirmada">
                        Confirmada
                      </option>

                      <option value="cancelada">
                        Cancelada
                      </option>

                    </select>

                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-[var(--color-text-secondary)]">

                    <div>
                      <span className="text-[10px] uppercase tracking-wider block">
                        Nascimento
                      </span>

                      <span className="text-[var(--color-text-main)]">
                        {formatBirthDate(reg.birthDate)}
                      </span>

                      {calculateAge(reg.birthDate) !== null && (
                        <span className="block text-[10px]">
                          {calculateAge(reg.birthDate)} anos
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider block">
                        CPF
                      </span>

                      <span className="font-mono text-[var(--color-text-main)]">
                        {maskCpf(reg.cpf)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider block">
                        Telefone
                      </span>

                      <span className="text-[var(--color-text-main)]">
                        {reg.phone}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider block">Kit</span>
                      <span className="text-[var(--color-text-main)]">Camisa {reg.shirtSize || '—'} · Chinelo {reg.slipperSize || '—'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider block">
                        Inscrição
                      </span>

                      <span>
                        {new Date(reg.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                  </div>

                  <div className="pt-2 border-t border-[var(--color-border)]/50 flex items-center justify-between gap-2">

                    <button
                      onClick={() => handleWhatsAppContact(reg)}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => { setShowSensitiveData(false); setSelectedReg(reg); }}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-[var(--color-card-bg)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detalhes</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(reg)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              ))}

            </div>
          </>
        )}
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-40 bg-[var(--color-card-bg)]"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[var(--color-text-secondary)]">Página <strong className="text-[var(--color-text-main)]">{safePage}</strong> de {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-40 bg-[var(--color-card-bg)]"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedReg && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">

            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">

              <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
                Ficha da Participante
              </h4>

              <button
                onClick={() => setSelectedReg(null)}
                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="space-y-4 text-xs sm:text-sm">

              <div className="p-3 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-between">

                <div>

                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Protocolo
                  </span>

                  <p className="font-mono font-bold text-[var(--color-primary)] text-sm">
                    {selectedReg.protocol}
                  </p>

                </div>

                <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full bg-white border border-[var(--color-border)]">
                  {selectedReg.status}
                </span>

              </div>

              <div>
                <span className="text-[var(--color-text-secondary)] block text-xs">
                  Nome Completo:
                </span>

                <span className="font-semibold text-base text-[var(--color-text-title)]">
                  {selectedReg.fullName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    Data de Nascimento:
                  </span>

                  <span className="font-medium">
                    {formatBirthDate(selectedReg.birthDate)}
                  </span>

                  {calculateAge(selectedReg.birthDate) !== null && (
                    <span className="block text-xs text-[var(--color-text-secondary)]">
                      {calculateAge(selectedReg.birthDate)} anos
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    Telefone:
                  </span>

                  <span className="font-medium">
                    {selectedReg.phone}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    CPF:
                  </span>

                  <span className="font-mono font-medium">
                    {showSensitiveData ? selectedReg.cpf : maskCpf(selectedReg.cpf)}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    RG:
                  </span>

                  <span className="font-medium">
                    {showSensitiveData ? selectedReg.rg : maskRg(selectedReg.rg)}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    Endereço Completo:
                  </span>

                  <span className="font-medium">
                    {showSensitiveData ? selectedReg.address : maskAddress(selectedReg.address)}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    Número do Chinelo:
                  </span>

                  <span className="font-medium">
                    {selectedReg.slipperSize}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    Tamanho da Camisa:
                  </span>

                  <span className="font-medium">
                    {selectedReg.shirtSize || 'Não informado'}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--color-text-secondary)] block text-xs">
                    Declaração:
                  </span>

                  <span className="font-medium text-emerald-600">
                    {selectedReg.acknowledgement
                      ? 'Ciente'
                      : 'Não informado'}
                  </span>
                </div>

              </div>

              <div>
                <span className="text-[var(--color-text-secondary)] block text-xs">
                  Registrada em:
                </span>

                <span>
                  {new Date(selectedReg.createdAt).toLocaleDateString(
                    'pt-BR'
                  )}{' '}
                  às{' '}
                  {new Date(selectedReg.createdAt).toLocaleTimeString(
                    'pt-BR',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </span>
              </div>

            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                CPF, RG e endereço ficam ocultos por padrão para reduzir exposição desnecessária de dados pessoais.
              </p>
              <button
                type="button"
                onClick={() => setShowSensitiveData((value) => !value)}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-main)] hover:bg-[var(--color-bg-secondary)] whitespace-nowrap"
              >
                {showSensitiveData ? 'Ocultar dados' : 'Mostrar dados completos'}
              </button>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-2">

              <button
                onClick={() => handleWhatsAppContact(selectedReg)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </button>

              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
              >
                Fechar
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Modal de exclusão */}
      {deleteTarget && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">

            <div className="flex items-center gap-3 text-red-600">

              <AlertTriangle className="w-6 h-6" />

              <h4 className="text-base font-serif font-bold text-[var(--color-text-title)]">
                Excluir Inscrição?
              </h4>

            </div>

            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">

              Você está prestes a excluir permanentemente a inscrição de{' '}

              <strong className="text-[var(--color-text-title)]">
                {deleteTarget.fullName}
              </strong>{' '}

              (Protocolo: {deleteTarget.protocol}).

              Esta ação não poderá ser desfeita.

            </p>

            <div className="pt-3 flex items-center justify-end gap-3">

              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
