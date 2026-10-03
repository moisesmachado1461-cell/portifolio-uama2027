import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

const tables = [
  ['admins', 'SELECT id, username, password_hash, salt, created_at FROM admins ORDER BY id'],
  ['registrations', 'SELECT * FROM registrations ORDER BY created_at'],
  ['app_settings', 'SELECT * FROM app_settings ORDER BY key'],
  ['gallery', 'SELECT * FROM gallery ORDER BY sort_order, id'],
  ['videos', 'SELECT * FROM videos ORDER BY sort_order, id'],
  ['testimonials', 'SELECT * FROM testimonials ORDER BY sort_order, id'],
  ['admin_audit_logs', 'SELECT id, actor, action, path, method, status_code, ip_hash, created_at FROM admin_audit_logs ORDER BY id'],
];

const now = new Date();
const stamp = now.toISOString().replace(/[:.]/g, '-');
const outDir = path.resolve('backups');
const outFile = path.join(outDir, `uama-backup-${stamp}.uama-backup.json`);

try {
  await fs.mkdir(outDir, { recursive: true });

  const payload = {
    format: 'uama-postgres-backup',
    version: 1,
    createdAt: now.toISOString(),
    database: {},
  };

  for (const [name, sql] of tables) {
    const result = await pool.query(sql);
    payload.database[name] = result.rows;
  }

  const json = JSON.stringify(payload, null, 2);
  const sha256 = crypto.createHash('sha256').update(json).digest('hex');
  payload.sha256 = sha256;

  const finalJson = JSON.stringify(payload, null, 2);
  await fs.writeFile(outFile, finalJson, { encoding: 'utf8', mode: 0o600 });

  console.log('BACKUP UAMA CRIADO COM SUCESSO');
  console.log('Arquivo:', outFile);
  console.log('Inscrições:', payload.database.registrations.length);
  console.log('Galeria:', payload.database.gallery.length);
  console.log('Vídeos:', payload.database.videos.length);
  console.log('Depoimentos:', payload.database.testimonials.length);
  console.log('SHA-256:', sha256);
  console.log('IMPORTANTE: este arquivo contém dados pessoais. Guarde-o em local privado e nunca envie ao GitHub.');
} catch (error) {
  console.error('ERRO AO CRIAR BACKUP');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
