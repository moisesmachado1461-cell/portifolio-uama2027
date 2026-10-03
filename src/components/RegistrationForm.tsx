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
  Loader2,
} from 'lucide-react';
import { isValidCPF, maskCPF, isValidPhone, maskPhone } from '../utils/validation.js';
import { Registration } from '../types/index.js';

type RegistrationReceipt = Pick<Registration, 'id' | 'protocol' | 'fullName' | 'status' | 'createdAt'>;

interface RegistrationFormProps {
  onSuccess?: (reg: RegistrationReceipt) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [slipperSize, setSlipperSize] = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [acknowledgement, setAcknowledgement] = useState(false);

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] =
    useState<RegistrationReceipt | null>(null);

  const isNameValid = fullName.trim().length >= 3;
  const isBirthDateValid = /^\d{4}-\d{2}-\d{2}$/.test(birthDate);
  const isPhoneValid = isValidPhone(phone);
  const isAddressValid = address.trim().length >= 5;
  const isRgValid = rg.trim().length >= 4;
  const isCpfValid = isValidCPF(cpf);
  const isSlipperSizeValid = slipperSize.trim().length > 0;
  const isShirtSizeValid = shirtSize.trim().length > 0;

  const isFormValid =
    isNameValid &&
    isBirthDateValid &&
    isPhoneValid &&
    isAddressValid &&
    isRgValid &&
    isCpfValid &&
    isSlipperSizeValid &&
    isShirtSizeValid &&
    acknowledgement;

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(maskCPF(e.target.value));
    clearError();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      birthDate: true,
      phone: true,
      address: true,
      rg: true,
      cpf: true,
      slipperSize: true,
      shirtSize: true,
      acknowledgement: true,
    });

    if (!isFormValid) {
      if (!isNameValid) {
        setErrorMessage('Por favor, informe seu nome completo.');
      } else if (!isBirthDateValid) {
        setErrorMessage('Informe uma data de nascimento válida.');
      } else if (!isPhoneValid) {
        setErrorMessage(
          'Telefone com DDD inválido. Digite 10 ou 11 dígitos.'
        );
      } else if (!isAddressValid) {
        setErrorMessage('Por favor, informe seu endereço completo.');
      } else if (!isRgValid) {
        setErrorMessage('Por favor, informe seu RG.');
      } else if (!isCpfValid) {
        setErrorMessage('CPF inválido. Verifique os números informados.');
      } else if (!isSlipperSizeValid) {
        setErrorMessage('Informe o número do chinelo.');
      } else if (!isShirtSizeValid) {
        setErrorMessage('Informe o tamanho da camisa.');
      } else if (!acknowledgement) {
        setErrorMessage(
          'É necessário confirmar que você está ciente da condição de não devolução em caso de desistência.'
        );
      }

      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          birthDate,
          phone: phone.trim(),
          address: address.trim(),
          rg: rg.trim(),
          cpf: cpf.trim(),
          slipperSize: slipperSize.trim(),
          shirtSize: shirtSize.trim(),
          acknowledgement,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error || 'Erro ao realizar inscrição. Tente novamente.'
        );
        setIsLoading(false);
        return;
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#78350F', '#B8860B', '#9A3412', '#F4EFEA'],
      });

      setSuccessRegistration(data.registration);

      if (onSuccess) {
        onSuccess(data.registration);
      }
    } catch {
      setErrorMessage(
        'Falha na conexão com o servidor. Verifique sua internet e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setBirthDate('');
    setPhone('');
    setAddress('');
    setRg('');
    setCpf('');
    setSlipperSize('');
    setShirtSize('');
    setAcknowledgement(false);
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
    <section
      id="inscricao"
      className="py-20 bg-[var(--color-bg-main)] border-t border-[var(--color-border)]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Inscrição UAMA 2026
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            Ficha de dados
          </h2>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
            Preencha corretamente seus dados para realizar sua inscrição no
            Retiro Anual de Mulheres UAMA.
          </p>
        </div>

        {successRegistration ? (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800">
                Inscrição realizada com sucesso
              </span>

              <h3 className="text-3xl font-serif font-bold text-[var(--color-text-title)]">
                Seja muito bem-vinda,{' '}
                {successRegistration.fullName.split(' ')[0]}!
              </h3>

              <p className="text-sm text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed">
                Seus dados foram registrados pela coordenação do Retiro UAMA.
                Guarde seu protocolo de inscrição.
              </p>
            </div>

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
                  Inscrição Registrada
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
                  <span className="text-[var(--color-text-secondary)]">Status:</span>{' '}
                  <span className="font-medium text-[var(--color-text-title)]">
                    {successRegistration.status === 'pendente' ? 'Pendente de confirmação' : successRegistration.status}
                  </span>
                </div>

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
                Sua inscrição foi registrada. A coordenação poderá entrar em
                contato pelo telefone informado.
              </div>
            </div>

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
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)]" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div role="alert" aria-live="polite" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              {/* Nome */}
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
                  maxLength={120}
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearError();
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, fullName: true }))
                  }
                  placeholder="Digite seu nome completo"
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors ${
                    touched.fullName && !isNameValid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                  }`}
                />

                {touched.fullName && !isNameValid && (
                  <p className="text-[11px] text-red-600">
                    Informe seu nome completo.
                  </p>
                )}
              </div>

              {/* Data + Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="birthDate"
                    className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                  >
                    Data de Nascimento <span className="text-red-600">*</span>
                  </label>

                  <input
                    id="birthDate"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => {
                      setBirthDate(e.target.value);
                      clearError();
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, birthDate: true }))
                    }
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden transition-colors ${
                      touched.birthDate && !isBirthDateValid
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                  >
                    Telefone com DDD <span className="text-red-600">*</span>
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    maxLength={15}
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, phone: true }))
                    }
                    placeholder="(00) 00000-0000"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors ${
                      touched.phone && !isPhoneValid
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                    }`}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-1.5">
                <label
                  htmlFor="address"
                  className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                >
                  Endereço Completo <span className="text-red-600">*</span>
                </label>

                <textarea
                  id="address"
                  required
                  rows={3}
                  maxLength={250}
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    clearError();
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, address: true }))
                  }
                  placeholder="Rua, número, bairro, cidade, estado e CEP"
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors resize-none ${
                    touched.address && !isAddressValid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                  }`}
                />
              </div>

              {/* RG + CPF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="rg"
                    className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                  >
                    RG <span className="text-red-600">*</span>
                  </label>

                  <input
                    id="rg"
                    type="text"
                    required
                    maxLength={30}
                    autoComplete="off"
                    value={rg}
                    onChange={(e) => {
                      setRg(e.target.value);
                      clearError();
                    }}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, rg: true }))
                    }
                    placeholder="Digite seu RG"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors ${
                      touched.rg && !isRgValid
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                    }`}
                  />
                </div>

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
                    autoComplete="off"
                    value={cpf}
                    onChange={handleCpfChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, cpf: true }))
                    }
                    placeholder="000.000.000-00"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono bg-[var(--color-card-bg)] text-[var(--color-text-main)] placeholder-[var(--color-text-secondary)]/60 focus:outline-hidden transition-colors ${
                      touched.cpf && !isCpfValid
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                    }`}
                  />

                  {touched.cpf && !isCpfValid && (
                    <p className="text-[11px] text-red-600">
                      CPF inválido. Verifique os números digitados.
                    </p>
                  )}
                </div>
              </div>

              {/* Número do chinelo */}
              <div className="space-y-1.5">
                <label
                  htmlFor="slipperSize"
                  className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                >
                  Número do Chinelo <span className="text-red-600">*</span>
                </label>

                <select
                  id="slipperSize"
                  required
                  value={slipperSize}
                  onChange={(e) => {
                    setSlipperSize(e.target.value);
                    clearError();
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, slipperSize: true }))
                  }
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden transition-colors ${
                    touched.slipperSize && !isSlipperSizeValid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                  }`}
                >
                  <option value="">Selecione</option>
                  {Array.from({ length: 16 }, (_, index) => 30 + index).map((size) => (
                    <option key={size} value={String(size)}>{size}</option>
                  ))}
                </select>
              </div>


              {/* Tamanho da camisa */}
              <div className="space-y-1.5">
                <label
                  htmlFor="shirtSize"
                  className="block text-xs uppercase tracking-wider font-semibold text-[var(--color-text-title)]"
                >
                  Tamanho da Camisa <span className="text-red-600">*</span>
                </label>

                <select
                  id="shirtSize"
                  required
                  value={shirtSize}
                  onChange={(e) => {
                    setShirtSize(e.target.value);
                    clearError();
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, shirtSize: true }))
                  }
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-[var(--color-card-bg)] text-[var(--color-text-main)] focus:outline-hidden transition-colors ${
                    touched.shirtSize && !isShirtSizeValid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[var(--color-border)] focus:border-[var(--color-form-focus)]'
                  }`}
                >
                  <option value="">Selecione</option>
                  {['PP', 'P', 'M', 'G', 'GG', 'XGG', 'G1', 'G2', 'G3'].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Termo obrigatório */}
              <div
                className={`p-4 rounded-xl border transition-colors ${
                  touched.acknowledgement && !acknowledgement
                    ? 'border-red-300 bg-red-50'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)]'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgement}
                    onChange={(e) => {
                      setAcknowledgement(e.target.checked);
                      clearError();
                    }}
                    className="mt-1 w-4 h-4 accent-[var(--color-primary)]"
                  />

                  <span className="text-sm leading-relaxed text-[var(--color-text-main)]">
                    Estou ciente de que{' '}
                    <strong>
                      NÃO SERÁ DEVOLVIDO NENHUM VALOR
                    </strong>{' '}
                    caso haja desistência.
                  </span>
                </label>

                <p className="mt-2 ml-7 text-xs text-[var(--color-text-secondary)]">
                  <span className="font-semibold">Sim, estou ciente.</span>
                </p>
              </div>

              {/* Aviso de privacidade */}
              <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-start gap-2.5 text-xs text-[var(--color-text-secondary)]">
                <Lock className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />

                <p className="leading-relaxed">
                  Seus dados serão utilizados somente pela coordenação do Retiro UAMA
                  para organizar sua participação, entrar em contato quando necessário
                  e administrar o evento. O protocolo é a informação recomendada para
                  guardar e compartilhar.
                </p>
              </div>

              {/* Botão */}
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
                      <span>Enviar Inscrição</span>
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