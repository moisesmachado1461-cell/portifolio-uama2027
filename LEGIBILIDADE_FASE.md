# UAMA — Fase principal 1: Legibilidade e contraste

Esta fase melhora a leitura sem alterar a estrutura ou funcionalidades do site.

Principais mudanças:
- texto secundário com contraste mais forte;
- textos pequenos elevados para tamanhos mais confortáveis;
- maior peso visual em labels, botões e campos;
- melhor espaçamento entre linhas;
- foco visível para teclado;
- melhoria específica em telas pequenas;
- suporte a `prefers-contrast: more`.

## Teste rápido
1. `npm.cmd run build`
2. `npm.cmd run dev`
3. Abrir `http://localhost:3000`
4. Conferir Hero, Sobre, Informações, Formulário e Rodapé no celular/desktop.
5. Conferir `/admin` para garantir que nenhuma funcionalidade foi afetada.
