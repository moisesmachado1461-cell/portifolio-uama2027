import React, { useEffect, useState } from 'react';
import { ArrowLeft, Database, Eye, FileText, Lock, Mail, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { ThemeProvider, DEFAULT_THEME_CONFIG } from '../context/ThemeContext.js';
import { PublicData } from '../types/index.js';

export const PrivacyPage: React.FC = () => {
  const [publicData, setPublicData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Privacidade | Retiro UAMA';
    fetch('/api/public-data')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Falha ao carregar dados públicos'))))
      .then((data: PublicData) => setPublicData(data))
      .catch(() => setPublicData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#78350F] border-t-transparent animate-spin" />
      </div>
    );
  }

  const eventInfo = publicData?.eventInfo;
  const theme = publicData?.theme || DEFAULT_THEME_CONFIG;

  return (
    <ThemeProvider initialTheme={theme}>
      <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-main)]">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:opacity-80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </a>

          <section className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="max-w-2xl space-y-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">Privacidade e proteção de dados</p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-text-title)]">Aviso de Privacidade</h1>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)]">
                Este aviso explica, de forma simples, como os dados informados na inscrição do Retiro UAMA são utilizados e protegidos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-10">
              <InfoCard icon={FileText} title="Dados coletados">
                Nome, data de nascimento, telefone, endereço, RG, CPF, número do chinelo, tamanho da camisa e informações necessárias para a inscrição.
              </InfoCard>
              <InfoCard icon={UserRoundCheck} title="Finalidade">
                Organizar a inscrição, identificar a participante, administrar o evento, preparar itens do retiro e permitir contato da coordenação quando necessário.
              </InfoCard>
              <InfoCard icon={Eye} title="Acesso aos dados">
                O acesso é restrito à área administrativa e deve ser limitado às pessoas responsáveis pela organização do retiro.
              </InfoCard>
              <InfoCard icon={Database} title="Armazenamento">
                Os dados são armazenados no sistema de inscrições e devem ser mantidos apenas pelo tempo necessário para a organização do evento e obrigações aplicáveis.
              </InfoCard>
              <InfoCard icon={Lock} title="Segurança">
                O sistema utiliza autenticação administrativa, conexão HTTPS, proteção de sessão e controles técnicos para reduzir o risco de acesso indevido.
              </InfoCard>
              <InfoCard icon={Mail} title="Dúvidas e solicitações">
                Para dúvidas sobre seus dados, correções ou solicitações relacionadas à privacidade, entre em contato com a coordenação pelos canais oficiais abaixo.
              </InfoCard>
            </div>

            <div className="space-y-6 text-sm leading-relaxed">
              <section>
                <h2 className="font-semibold text-[var(--color-text-title)] mb-2">Seus direitos</h2>
                <p className="text-[var(--color-text-secondary)]">
                  Você pode solicitar informações sobre os dados cadastrados, correção de informações incorretas e, quando aplicável, exclusão ou outras providências relacionadas ao tratamento dos seus dados.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-[var(--color-text-title)] mb-2">Compartilhamento</h2>
                <p className="text-[var(--color-text-secondary)]">
                  Os dados devem ser utilizados apenas para as finalidades relacionadas ao Retiro UAMA e não devem ser divulgados publicamente. Eventuais acessos por fornecedores de infraestrutura devem se limitar ao funcionamento técnico do sistema.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-[var(--color-text-title)] mb-2">Contato</h2>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-1">
                  {eventInfo?.contactEmail && (
                    <p><span className="font-medium">E-mail:</span> <a className="text-[var(--color-primary)] underline" href={`mailto:${eventInfo.contactEmail}`}>{eventInfo.contactEmail}</a></p>
                  )}
                  {eventInfo?.contactPhone && (
                    <p><span className="font-medium">Telefone:</span> {eventInfo.contactPhone}</p>
                  )}
                  {!eventInfo?.contactEmail && !eventInfo?.contactPhone && (
                    <p className="text-[var(--color-text-secondary)]">Utilize os canais oficiais da coordenação UAMA.</p>
                  )}
                </div>
              </section>

              <p className="text-xs text-[var(--color-text-secondary)] pt-4 border-t border-[var(--color-border)]">
                Última atualização: outubro de 2026. Este aviso deve ser revisto sempre que houver mudança relevante na forma de coleta ou uso dos dados.
              </p>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
};

const InfoCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, children }) => (
  <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5">
    <Icon className="w-5 h-5 text-[var(--color-primary)] mb-3" />
    <h2 className="font-semibold text-[var(--color-text-title)] mb-2">{title}</h2>
    <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-text-secondary)]">{children}</p>
  </article>
);
