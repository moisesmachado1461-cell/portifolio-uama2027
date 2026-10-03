import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const file = process.argv[2];
if (!file) {
  console.error('Uso: npm run backup:check -- "backups\\arquivo.uama-backup.json"');
  process.exit(1);
}

try {
  const raw = await fs.readFile(file, 'utf8');
  const parsed = JSON.parse(raw);

  if (parsed.format !== 'uama-postgres-backup' || parsed.version !== 1 || !parsed.database) {
    throw new Error('Formato de backup UAMA inválido.');
  }

  const expectedTables = ['admins','registrations','app_settings','gallery','videos','testimonials','admin_audit_logs'];
  for (const table of expectedTables) {
    if (!Array.isArray(parsed.database[table])) throw new Error(`Tabela ausente no backup: ${table}`);
  }

  const expectedHash = parsed.sha256;
  const copy = { ...parsed };
  delete copy.sha256;
  const calculatedHash = crypto.createHash('sha256').update(JSON.stringify(copy, null, 2)).digest('hex');

  if (!expectedHash || calculatedHash !== expectedHash) {
    throw new Error('Checksum inválido: o arquivo pode ter sido alterado ou corrompido.');
  }

  console.log('BACKUP UAMA VÁLIDO');
  console.log('Criado em:', parsed.createdAt);
  console.log('Inscrições:', parsed.database.registrations.length);
  console.log('Checksum: OK');
} catch (error) {
  console.error('BACKUP INVÁLIDO');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
