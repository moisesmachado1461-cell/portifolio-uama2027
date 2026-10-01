import React, { useState } from 'react';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, username: string) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Falha ao autenticar.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('uama_admin_token', data.token);
      localStorage.setItem('uama_admin_user', data.username);
      onLoginSuccess(data.token, data.username);
    } catch {
      setError('Erro de comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-[var(--color-text-title)]">
          Área da Coordenação
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Acesso restrito para gerenciamento de inscrições, temas e conteúdos do Retiro UAMA.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
            Usuário
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
              placeholder="admin"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]">
            Senha
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--color-form-focus)]"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-90 flex items-center justify-center gap-1.5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Entrar no Painel</span>}
          </button>
        </div>
      </form>
    </div>
  );
};
