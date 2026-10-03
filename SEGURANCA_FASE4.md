# UAMA — Segurança Fase 4

Esta sobreposição conclui o endurecimento principal desta fase:

- tokens de sessão administrativa passam a ser armazenados no PostgreSQL apenas como hash SHA-256;
- a resposta pública da inscrição deixa de devolver CPF, RG, endereço, telefone, nascimento e tamanhos;
- resposta de inscrição usa `Cache-Control: no-store`;
- `data/database.json` fica explicitamente ignorado pelo Git;
- inclui um smoke test sem credenciais para validar healthcheck, bloqueio das rotas admin e headers de segurança.

## Limpeza de scripts temporários

Depois de confirmar que o PostgreSQL já está funcionando, remova do repositório os scripts usados apenas na migração/diagnóstico:

```powershell
git rm --ignore-unmatch server/check-registrations.ts server/test-postgres.ts server/init-postgres.ts server/migrate-json-to-postgres.ts server/reset-admin-password.ts
```

## Testes

```powershell
npm.cmd run build
npm.cmd run dev
node scripts/security-smoke.mjs http://localhost:3000
```

Após o deploy no Render:

```powershell
node scripts/security-smoke.mjs https://portifolio-uama2027.onrender.com
```

Observação: sessões administrativas antigas serão invalidadas após esta mudança, porque os novos tokens passam a ser armazenados em hash. Basta fazer login novamente.
