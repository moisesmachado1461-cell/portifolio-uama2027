import 'dotenv/config';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;
const file = process.argv[2];
const confirmed = process.argv.includes('--confirm');

if (!file || !confirmed) {
  console.error('Restauração bloqueada por segurança.');
  console.error('Uso: npm run restore:db -- "backups\\arquivo.uama-backup.json" --confirm');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
});

try {
  const raw = await fs.readFile(file, 'utf8');
  const backup = JSON.parse(raw);
  if (backup.format !== 'uama-postgres-backup' || backup.version !== 1) throw new Error('Backup incompatível.');

  const copy = { ...backup };
  const expectedHash = copy.sha256;
  delete copy.sha256;
  const calculatedHash = crypto.createHash('sha256').update(JSON.stringify(copy, null, 2)).digest('hex');
  if (!expectedHash || expectedHash !== calculatedHash) throw new Error('Checksum inválido. Restauração cancelada.');

  const db = backup.database;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Sessões e limites nunca são restaurados; todos precisarão autenticar novamente.
    await client.query('DELETE FROM admin_sessions');
    await client.query('DELETE FROM security_rate_limits');

    await client.query('DELETE FROM admin_audit_logs');
    await client.query('DELETE FROM registrations');
    await client.query('DELETE FROM gallery');
    await client.query('DELETE FROM videos');
    await client.query('DELETE FROM testimonials');
    await client.query('DELETE FROM app_settings');
    await client.query('DELETE FROM admins');

    for (const row of db.admins) {
      await client.query('INSERT INTO admins (id,username,password_hash,salt,created_at) VALUES ($1,$2,$3,$4,$5)', [row.id,row.username,row.password_hash,row.salt,row.created_at]);
    }
    for (const row of db.registrations) {
      await client.query(`INSERT INTO registrations (id,protocol,full_name,birth_date,phone,address,rg,cpf,slipper_size,shirt_size,acknowledgement,status,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, [row.id,row.protocol,row.full_name,row.birth_date,row.phone,row.address,row.rg,row.cpf,row.slipper_size,row.shirt_size,row.acknowledgement,row.status,row.created_at]);
    }
    for (const row of db.app_settings) {
      await client.query('INSERT INTO app_settings (key,value,updated_at) VALUES ($1,$2::jsonb,$3)', [row.key,JSON.stringify(row.value),row.updated_at]);
    }
    for (const row of db.gallery) {
      await client.query('INSERT INTO gallery (id,url,title,category,is_featured,sort_order) VALUES ($1,$2,$3,$4,$5,$6)', [row.id,row.url,row.title,row.category,row.is_featured,row.sort_order]);
    }
    for (const row of db.videos) {
      await client.query('INSERT INTO videos (id,title,description,embed_url,thumbnail_url,duration,is_active,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [row.id,row.title,row.description,row.embed_url,row.thumbnail_url,row.duration,row.is_active,row.sort_order]);
    }
    for (const row of db.testimonials) {
      await client.query('INSERT INTO testimonials (id,name,edition,quote,avatar_url,is_active,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)', [row.id,row.name,row.edition,row.quote,row.avatar_url,row.is_active,row.sort_order]);
    }
    for (const row of db.admin_audit_logs) {
      await client.query('INSERT INTO admin_audit_logs (id,actor,action,path,method,status_code,ip_hash,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [row.id,row.actor,row.action,row.path,row.method,row.status_code,row.ip_hash,row.created_at]);
    }

    await client.query("SELECT setval(pg_get_serial_sequence('admins','id'), COALESCE((SELECT MAX(id) FROM admins),1), true)");
    await client.query("SELECT setval(pg_get_serial_sequence('admin_audit_logs','id'), COALESCE((SELECT MAX(id) FROM admin_audit_logs),1), true)");
    await client.query('COMMIT');
    console.log('RESTAURAÇÃO UAMA CONCLUÍDA COM SUCESSO');
    console.log('Inscrições restauradas:', db.registrations.length);
    console.log('Sessões administrativas foram zeradas por segurança.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
} catch (error) {
  console.error('ERRO NA RESTAURAÇÃO');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
