import React, { useState } from 'react';
import { KeyRound, Check, AlertCircle, Loader2, Download, Archive } from 'lucide-react';

export const AdminSecurityTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'A confirmação de senha não confere.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const token = localStorage.getItem('uama_admin_token');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erro ao alterar senha.' });
      } else {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-[var(--color-border)]">
        <h3 className="text-xl font-serif font-bold text-[var(--color-text-title)] flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[var(--color-primary)]" />
          <span>Segurança & Senha de Acesso</span>
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Altere a senha de acesso administrativo à coordenação do retiro.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
            Senha Atual
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
            Nova Senha
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo de 6 caracteres"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center justify-center gap-1.5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Atualizar Senha</span>}
          </button>
        </div>
      </form>

      {/* Backup and Source Code Download Section */}
      <div className="pt-6 border-t border-[var(--color-border)] space-y-3">
        <h4 className="text-sm font-serif font-bold text-[var(--color-text-title)] flex items-center gap-2">
          <Archive className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Backup & Download do Código-Fonte</span>
        </h4>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Baixe um arquivo compactado (<strong>.ZIP</strong>) contendo todo o código-fonte, banco de dados e imagens para guardar no seu computador ou publicar em outro servidor (Render, Railway, VPS).
        </p>
        <a
          href="/api/download-project"
          download="retiro-mulheres-uama-codigo-fonte.zip"
          className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-[var(--color-text-main)] bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-primary)] transition-all flex items-center justify-center gap-2 shadow-xs group"
        >
          <Download className="w-4 h-4 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
          <span>Baixar Arquivos do Site (.ZIP)</span>
        </a>
      </div>
    </div>
  );
};
