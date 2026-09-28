import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight,
  Share2,
  Printer,
  RotateCcw,
  Sparkles,
  Heart,
  Loader2,
} from 'lucide-react';
import { isValidCPF, maskCPF, isValidPhone, maskPhone } from '../utils/validation.js';
import { Registration } from '../types/index.js';

interface RegistrationFormProps {
  onSuccess?: (reg: Registration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Touched state for immediate friendly inline validation
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] = useState<Registration | null>(null);

  // Validation checks
  const isNameValid = fullName.trim().length >= 3;
  const isCpfValid = isValidCPF(cpf);
  const isPhoneValid = isValidPhone(phone);
  const isFormValid = isNameValid && isCpfValid && isPhoneValid;

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(maskCPF(e.target.value));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, cpf: true, phone: true });

    if (!isFormValid) {
      if (!isNameValid) {
        setErrorMessage('Por favor, informe seu nome completo.');
      } else if (!isCpfValid) {
        setErrorMessage('CPF inválido. Verifique os números informados.');
      } else if (!isPhoneValid) {
        setErrorMessage('Telefone com DDD inválido. Digite 10 ou 11 dígitos.');
      }
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          cpf: cpf.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Erro ao realizar inscrição. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Success! Fire celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#78350F', '#B8860B', '#9A3412', '#F4EFEA'],
      });

      setSuccessRegistration(data.registration);
      if (onSuccess) onSuccess(data.registration);
    } catch {
      setErrorMessage('Falha na conexão com o servidor. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setCpf('');
    setPhone('');
    setNotes('');
    setTouched({});
    setErrorMessage(null);
    setSuccessRegistration(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!successRegistration) return;
    const text = encodeURIComponent(
      `Olá! Realizei minha inscrição para o Retiro Anual de Mulheres UAMA!\n` +
      `Participante: ${successRegistration.fullName}\n` +
      `Protocolo: ${successRegistration.protocol}\n` +
      `Mal posso esperar por este momento de renovação!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="inscricao" className="py-20 bg-[var(--color-bg-main)] border-t border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Faça Parte Deste Encontro
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            Garanta a sua vaga no retiro
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
            Preencha seus dados para assegurar sua pré-inscrição com prioridade. Nossa equipe entrará em contato com todas as instruções de confirmação.
          </p>
        </div>

        {/* If Success Screen */}
        {successRegistration ? (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800">
                Inscrição Registrada com Sucesso
              </span>
              <h3 className="text-3xl font-serif font-bold text-[var(--color-text-title)]">
                Seja muito bem-vinda, {successRegistration.fullName.split(' ')[0]}!
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed">
                Seu coração disse "sim" para um tempo singular de descanso e restauração espiritual. Estamos em oração por cada participante!
              </p>
            </div>

            {/* Voucher Card Print/Voucher Display */}
            <div className="max-w-md mx-auto p-4 sm:p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-left space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
                <div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Protocolo de Inscrição
                  </p>
                  <p className="font-mono text-sm sm:text-base font-bold text-[var(--color-primary)] break-all">
                    {successRegistration.protocol}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  Pré-Inscrição Registrada
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-[var(--color-text-secondary)]">Nome Completo:</span>{' '}
                  <span className="font-semibold text-[var(--color-text-title)] break-words">
                    {successRegistration.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">CPF:</span>{' '}
                  <span className="font-mono font-medium text-[var(--color-text-title)]">
                    {successRegistration.cpf}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">WhatsApp / Telefone:</span>{' '}
                  <span className="font-medium text-[var(--color-text-title)]">
                    {successRegistration.phone}
                  </span>
                </div>
                {successRegistration.notes && (
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Observações:</span>{' '}
                    <span className="italic text-[var(--color-text-title)] break-words">
                      {successRegistration.notes}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[var(--color-text-secondary)]">Data de Registro:</span>{' '}
                  <span className="text-[var(--color-text-title)]">
                    {new Date(successRegistration.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(successRegistration.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Próximos passos: Nossa coordenação enviará o informativo final de transporte, acomodações e detalhes de pagamento diretamente pelo WhatsApp.
              </div>
            </div>

            {/* Action buttons on voucher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={handleShareWhatsApp}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar no WhatsApp</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-[var(--color-text-main)] bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>

              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)] border border-transparent hover:border-[var(--color-border)] transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nova Inscrição</span>
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Form decorative top hairline */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              {/* Field 1: Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                >
                  Nome Completo <span className="text-red-600">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                  placeholder="Ex: Maria Carolina Silva"
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors ${
                    touched.fullName && !isNameValid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                  }`}
                />
                {touched.fullName && !isNameValid && (
                  <p className="text-[11px] text-red-600">Informe seu nome completo (mínimo de 3 letras).</p>
                )}
              </div>

              {/* Grid: CPF and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Field 2: CPF */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="cpf"
                    className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                  >
                    CPF <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={14}
                    value={cpf}
                    onChange={handleCpfChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, cpf: true }))}
                    placeholder="000.000.000-00"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors ${
                      touched.cpf && !isCpfValid
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                    }`}
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    {touched.cpf && !isCpfValid ? (
                      <p className="text-red-600">CPF inválido. Verifique os números digitados.</p>
                    ) : (
                      <p className="text-[var(--color-text-secondary)]">Necessário para seguro e credenciamento.</p>
                    )}
                  </div>
                </div>

                {/* Field 3: WhatsApp / Phone */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                  >
                    Telefone / WhatsApp <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    maxLength={15}
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                    placeholder="(00) 00000-0000"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors ${
                      touched.phone && !isPhoneValid
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                    }`}
                  />
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    Enviaremos a confirmação e avisos importantes por aqui.
                  </p>
                </div>
              </div>

              {/* Field 4: Dietary / Medical / Special Notes */}
              <div className="space-y-1.5">
                <label
                  htmlFor="notes"
                  className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                >
                  Observações Especiais <span className="text-[var(--color-text-secondary)] font-normal">(Opcional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Restrições alimentares (vegetariana, glúten, lactose), necessidade de quarto no térreo ou preferência de colega de quarto..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden focus:border-[var(--color-form-focus)] transition-colors"
                />
              </div>

              {/* Privacy & LGPD Notice */}
              <div className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-start gap-2.5 text-xs text-[var(--color-text-secondary)]">
                <Lock className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Seus dados estão protegidos e serão utilizados estritamente pela coordenação do Retiro UAMA para organização de vagas, transporte e comunicação oficial.
                </p>
              </div>

              {/* Submit CTA Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl font-medium text-sm sm:text-base text-[var(--color-button-text)] bg-[var(--color-button-bg)] hover:opacity-95 shadow-sm transition-all hover:translate-y-[-1px] active:translate-y-[0px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processando sua inscrição...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar Pré-Inscrição</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
