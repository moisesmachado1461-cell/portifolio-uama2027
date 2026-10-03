# UAMA — Monitoramento e saúde do sistema

Esta fase adiciona diagnóstico operacional sem expor dados pessoais:

- `/api/health`: confirma PostgreSQL, latência do banco e uptime do processo.
- `/api/ready`: confirma se a aplicação está pronta para receber tráfego.
- `X-Request-Id`: identificador por requisição para localizar erros nos logs.
- 404 controlado para endpoints de API inexistentes.
- tratamento final de erros Express e eventos de processo.
- `scripts/production-health.mjs`: teste local e de produção.

Teste local:

```powershell
node scripts/production-health.mjs http://localhost:3000
```

Teste produção:

```powershell
node scripts/production-health.mjs https://portifolio-uama2027.onrender.com
```
