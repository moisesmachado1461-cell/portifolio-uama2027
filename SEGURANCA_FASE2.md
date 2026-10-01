# UAMA — Segurança Fase 2

Esta sobreposição adiciona:

- rate limiting persistente no PostgreSQL para login e inscrição;
- proteção centralizada de todas as rotas `/api/admin/*`;
- verificação de mesma origem em requisições administrativas que alteram dados;
- tabela `security_rate_limits` criada automaticamente no PostgreSQL;
- `Retry-After` em bloqueios por excesso de tentativas.

## Aplicação
Copie `server.ts` e a pasta `server/` sobre o projeto atual, preservando `.env`.

## Teste

```powershell
npm.cmd run build
npm.cmd run dev
```

Valide login, logout, listagem e alteração de status no painel.
