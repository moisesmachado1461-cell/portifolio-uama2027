# Separação das áreas — UAMA

## Resultado
- Site público permanece em `/`.
- Administração passa a ser acessada somente em `/admin`.
- Botões e links administrativos foram removidos da experiência pública.
- O painel continua protegido pelas rotas `/api/admin/*` e pela sessão HttpOnly.
- `/admin` recebe `noindex`, `nofollow`, `noarchive` e `Cache-Control: no-store`.
- O frontend deixou de depender de token administrativo em `localStorage`.

## Testes
1. Abrir `/` e confirmar que não há botão Admin/Painel da Coordenação.
2. Abrir `/admin` e confirmar que aparece a tela de login.
3. Fazer login e testar inscrições/status/logout.
4. Abrir `/admin` em guia anônima e confirmar que exige login.
