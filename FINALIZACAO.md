# Finalização técnica — UAMA

Esta cópia foi revisada para preparação de produção.

## Correções aplicadas

- Removida a rota pública de download do código-fonte.
- Removidos botões de download do código no painel.
- Removidas credenciais padrão expostas na tela de login.
- Senha administrativa agora usa PBKDF2-SHA512 com 210.000 iterações.
- Comparação de senha com `timingSafeEqual`.
- Sessões administrativas expiram em 8 horas.
- Alteração de senha invalida todas as sessões.
- Rate limiting básico adicionado ao login e ao formulário de inscrição.
- Cabeçalhos básicos de segurança adicionados.
- Validações de data de nascimento, endereço, RG, chinelo e confirmação adicionadas no servidor.
- Escrita do banco JSON passou a usar arquivo temporário + rename.
- Registros, vídeos e depoimentos fictícios foram removidos da base entregue.
- Arquivo ZIP de código-fonte embutido no projeto foi removido.
- `.env` real foi removido da cópia final; use `.env.example` como referência.

## Antes do deploy

1. Execute `npm install`.
2. Execute `npm run lint`.
3. Execute `npm run build`.
4. Inicie localmente com `npm run dev` e teste formulário + painel.
5. No servidor, configure `NODE_ENV=production`.
6. Para uma base nova, configure `UAMA_ADMIN_INITIAL_PASSWORD` com pelo menos 12 caracteres.
7. Configure armazenamento persistente para a pasta `data` ou migre para PostgreSQL antes de receber inscrições reais em produção.
8. Cadastre apenas vídeos e depoimentos reais no painel.

## Observação de persistência

O projeto ainda usa `data/database.json`. Em hospedagens com disco efêmero, inscrições podem ser perdidas após reinício/deploy. Use disco persistente ou PostgreSQL.
