# UAMA — Correção de aniversários

## Objetivo
Corrigir o caso em que uma participante podia aparecer como aniversariante um dia antes.

## Causa
Datas no formato `YYYY-MM-DD` eram convertidas com `new Date(...)`. Esse formato pode ser interpretado como UTC e mudar o dia quando exibido em fuso horário negativo, como o horário de Brasília.

## Correção
- Data de nascimento tratada como data civil (ano/mês/dia), sem conversão para UTC.
- `isBirthdayToday` compara mês e dia diretamente.
- `calculateAge` usa os mesmos componentes locais.
- Incluído smoke test de regressão.

## Teste
Execute:

```powershell
npx.cmd tsx scripts/birthday-smoke.mjs
```

Resultado esperado:

```text
OK  aniversário usa a data do cadastro sem deslocamento de fuso
OK  idade calculada corretamente
ANIVERSÁRIO: smoke test aprovado.
```
