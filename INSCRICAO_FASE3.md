# UAMA — Fase Principal 3: Experiência de inscrição

## Melhorias incluídas

- confirmação de inscrição mais clara;
- protocolo com botão **Copiar protocolo**;
- foco automático na confirmação após o envio;
- bloco **Próximos passos** após a inscrição;
- orientação para não refazer cadastro com o mesmo CPF;
- melhor acessibilidade nos campos com erro;
- aviso para revisar os dados antes de enviar;
- confirmação continua sem expor CPF, RG, endereço ou telefone.

## Teste rápido

1. `npm.cmd run build`
2. `npm.cmd run dev`
3. Faça uma inscrição de teste.
4. Confira:
   - a tela rola/foca na confirmação;
   - o protocolo pode ser copiado;
   - aparecem os próximos passos;
   - dados pessoais sensíveis não aparecem na confirmação;
   - a inscrição continua aparecendo em `/admin`.
