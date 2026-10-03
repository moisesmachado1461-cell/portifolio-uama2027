# UAMA — Backup e recuperação do PostgreSQL

## Objetivo
Criar uma cópia local verificável dos dados importantes do UAMA sem versionar dados pessoais no GitHub.

## Criar backup

```powershell
npm.cmd run backup:db
```

O arquivo será criado em `backups/` e essa pasta é ignorada pelo Git.

## Validar o backup

Copie o caminho exibido pelo comando anterior e rode:

```powershell
npm.cmd run backup:check -- "backups\\NOME_DO_ARQUIVO.uama-backup.json"
```

O resultado esperado é `BACKUP UAMA VÁLIDO` e `Checksum: OK`.

## Recuperação

A restauração substitui o conteúdo das tabelas principais. Use somente quando houver necessidade real e, de preferência, após criar outro backup.

```powershell
npm.cmd run restore:db -- "backups\\NOME_DO_ARQUIVO.uama-backup.json" --confirm
```

Sessões administrativas e rate limits não são restaurados por segurança.

## Segurança
Os arquivos de backup contêm dados pessoais e hash da credencial administrativa. Não envie ao GitHub, não compartilhe por mensagens e guarde em local privado.
