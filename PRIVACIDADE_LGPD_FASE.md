# UAMA — Fase de Privacidade e LGPD básica

Esta fase adiciona transparência sobre o tratamento dos dados pessoais sem alterar o fluxo de inscrição nem o banco de dados.

## Incluído
- Página pública `/privacidade`.
- Explicação clara sobre dados coletados, finalidade, acesso, armazenamento, segurança e direitos.
- Contato da coordenação puxado das informações públicas do evento.
- Link de privacidade no rodapé.
- Aviso de privacidade junto ao formulário.

## Importante
Este texto é uma base operacional e de transparência para o site, não substitui revisão jurídica específica. A coordenação deve revisar se todos os dados solicitados (especialmente RG, CPF e endereço) são realmente necessários para a finalidade do retiro.

## Testes
1. `npm.cmd run build`
2. `npm.cmd run dev`
3. Abrir `http://localhost:3000/privacidade`
4. Abrir o formulário e confirmar o link para o Aviso de Privacidade.
5. Verificar o link "Privacidade" no rodapé.
