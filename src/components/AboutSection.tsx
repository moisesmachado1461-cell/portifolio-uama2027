import React from 'react';
import { Sparkles, Sun, Users, Feather } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-[var(--color-bg-main)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Propósito & História
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-title)] tracking-tight text-balance">
            Um refúgio de paz desenhado para você
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            O Retiro Anual de Mulheres UAMA nasceu do anseio de proporcionar um espaço sagrado onde cada mulher possa pausar a correria do cotidiano, ouvir a voz de Deus e redescobrir sua força e identidade.
          </p>
        </div>

        {/* Narrative & Image Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Curatorial Editorial Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-[var(--color-card-bg)] border border-[var(--color-card-border)] aspect-4/3">
              <img
                src="/src/assets/images/about_retreat_moment_1790618270317.jpg"
                alt="Encontro e diálogo entre participantes do retiro UAMA"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-serif italic">
                Momentos de partilha, oração e escuta atenta no pavilhão de retiro.
              </div>
            </div>

            {/* Quote Badge */}
            <div className="mt-4 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed italic">
              "Aqui não há julgamentos, títulos ou máscaras. Somos apenas mulheres unidas pelo mesmo amor e pela mesma fé."
            </div>
          </div>

          {/* Right: Editorial Prose with Drop Cap */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="space-y-4 text-sm sm:text-base text-[var(--color-text-main)] leading-relaxed">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[var(--color-primary)]">
                Realizado anualmente em setembro, o Retiro de Mulheres UAMA reúne participantes de diversas cidades e trajetórias de vida para três dias inesquecíveis. Nosso objetivo não é apenas oferecer um intervalo da rotina, mas promover um encontro transformador consigo mesma, com Deus e com uma comunidade acolhedora.
              </p>
              <p>
                A programação foi pensada com delicadeza e sensibilidade: palestras temáticas que abordam a saúde emocional, familiar e espiritual da mulher contemporânea; períodos de louvor intimista; dinâmicas em grupo que fortalecem amizades genuínas; e tempo de qualidade para o descanso do corpo e da mente.
              </p>
              <p>
                Se você está vivendo uma fase de sobrecarga, buscando clareza para decisões importantes ou simplesmente desejando celebrar as bênçãos da vida em boa companhia, este retiro foi preparado para você.
              </p>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border)]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-serif font-semibold text-base">
                  <Sun className="w-4 h-4 shrink-0" />
                  <span>Renovação</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Tempo exclusivo para cuidar da alma, restaurar as energias e alinhar propósitos.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-serif font-semibold text-base">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Comunhão</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Conversas sinceras, partilha de experiências e fortalecimento de laços de amizade.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-serif font-semibold text-base">
                  <Feather className="w-4 h-4 shrink-0" />
                  <span>Descanso</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Lazer, alimentação de primeira e contato com a natureza em um ambiente acolhedor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
