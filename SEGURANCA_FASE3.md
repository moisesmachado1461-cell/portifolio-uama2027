# Segurança Fase 3

- Auditoria administrativa persistida no PostgreSQL.
- A auditoria não grava senhas, CPF, RG, endereço nem corpo das requisições.
- O IP é armazenado somente como hash SHA-256.
- CPF, RG e endereço ficam mascarados por padrão no painel.
- Dados completos exigem ação explícita do administrador.
- Exportação CSV mostra aviso antes do download de dados pessoais.
- Endpoint protegido `/api/admin/audit-logs` fica disponível para futura tela de auditoria.
