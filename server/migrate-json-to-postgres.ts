import fs from 'fs';
import path from 'path';
import { pool } from './postgres.js';

const DB_FILE = path.resolve(process.cwd(), 'data', 'database.json');

async function migrate() {
  if (!fs.existsSync(DB_FILE)) {
    throw new Error('data/database.json não foi encontrado.');
  }

  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ADMIN
    await client.query(
      `
      INSERT INTO admins (username, password_hash, salt)
      VALUES ($1, $2, $3)
      ON CONFLICT (username)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        salt = EXCLUDED.salt
      `,
      [db.admin.username, db.admin.passwordHash, db.admin.salt]
    );

    // SESSÕES
    await client.query('DELETE FROM admin_sessions');

    for (const session of db.sessions || []) {
      await client.query(
        `
        INSERT INTO admin_sessions (token, expires_at)
        VALUES ($1, $2)
        ON CONFLICT (token) DO NOTHING
        `,
        [session.token, session.expiresAt]
      );
    }

    // TEMA
    await client.query(
      `
      INSERT INTO app_settings (key, value)
      VALUES ('theme', $1::jsonb)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW()
      `,
      [JSON.stringify(db.theme)]
    );

    // EVENTO
    await client.query(
      `
      INSERT INTO app_settings (key, value)
      VALUES ('eventInfo', $1::jsonb)
      ON CONFLICT (key)
      DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW()
      `,
      [JSON.stringify(db.eventInfo)]
    );

    // INSCRIÇÕES
    for (const reg of db.registrations || []) {
      await client.query(
        `
        INSERT INTO registrations (
          id,
          protocol,
          full_name,
          birth_date,
          phone,
          address,
          rg,
          cpf,
          slipper_size,
          shirt_size,
          acknowledgement,
          status,
          created_at
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
        )
        ON CONFLICT (id)
        DO UPDATE SET
          protocol = EXCLUDED.protocol,
          full_name = EXCLUDED.full_name,
          birth_date = EXCLUDED.birth_date,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          rg = EXCLUDED.rg,
          cpf = EXCLUDED.cpf,
          slipper_size = EXCLUDED.slipper_size,
          shirt_size = EXCLUDED.shirt_size,
          acknowledgement = EXCLUDED.acknowledgement,
          status = EXCLUDED.status,
          created_at = EXCLUDED.created_at
        `,
        [
          reg.id,
          reg.protocol,
          reg.fullName,
          reg.birthDate,
          reg.phone,
          reg.address,
          reg.rg,
          reg.cpf,
          reg.slipperSize,
          reg.shirtSize || '',
          reg.acknowledgement,
          reg.status,
          reg.createdAt,
        ]
      );
    }

    // GALERIA
    for (const item of db.gallery || []) {
      await client.query(
        `
        INSERT INTO gallery (
          id,
          url,
          title,
          category,
          is_featured,
          sort_order
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (id)
        DO UPDATE SET
          url = EXCLUDED.url,
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          is_featured = EXCLUDED.is_featured,
          sort_order = EXCLUDED.sort_order
        `,
        [
          item.id,
          item.url,
          item.title,
          item.category,
          !!item.isFeatured,
          item.order || 0,
        ]
      );
    }

    // VÍDEOS
    for (const item of db.videos || []) {
      await client.query(
        `
        INSERT INTO videos (
          id,
          title,
          description,
          embed_url,
          thumbnail_url,
          duration,
          is_active,
          sort_order
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (id)
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          embed_url = EXCLUDED.embed_url,
          thumbnail_url = EXCLUDED.thumbnail_url,
          duration = EXCLUDED.duration,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order
        `,
        [
          item.id,
          item.title,
          item.description || '',
          item.embedUrl,
          item.thumbnailUrl || '',
          item.duration || null,
          item.isActive !== false,
          item.order || 0,
        ]
      );
    }

    // DEPOIMENTOS
    for (const item of db.testimonials || []) {
      await client.query(
        `
        INSERT INTO testimonials (
          id,
          name,
          edition,
          quote,
          avatar_url,
          is_active,
          sort_order
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (id)
        DO UPDATE SET
          name = EXCLUDED.name,
          edition = EXCLUDED.edition,
          quote = EXCLUDED.quote,
          avatar_url = EXCLUDED.avatar_url,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order
        `,
        [
          item.id,
          item.name,
          item.edition || 'Participante',
          item.quote,
          item.avatarUrl || null,
          item.isActive !== false,
          item.order || 0,
        ]
      );
    }

    await client.query('COMMIT');

    const counts = await Promise.all([
      client.query('SELECT COUNT(*) FROM registrations'),
      client.query('SELECT COUNT(*) FROM gallery'),
      client.query('SELECT COUNT(*) FROM videos'),
      client.query('SELECT COUNT(*) FROM testimonials'),
    ]);

    console.log('MIGRAÇÃO CONCLUÍDA COM SUCESSO');
    console.log('Inscrições:', counts[0].rows[0].count);
    console.log('Galeria:', counts[1].rows[0].count);
    console.log('Vídeos:', counts[2].rows[0].count);
    console.log('Depoimentos:', counts[3].rows[0].count);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('ERRO NA MIGRAÇÃO');
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
