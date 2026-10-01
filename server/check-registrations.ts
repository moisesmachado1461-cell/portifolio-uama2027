import { pool } from './postgres.js';

try {
  const result = await pool.query(`
    SELECT
      protocol,
      full_name,
      shirt_size,
      status,
      created_at
    FROM registrations
    ORDER BY created_at DESC
    LIMIT 10
  `);

  console.log('TOTAL ENCONTRADO:', result.rowCount);
  console.table(result.rows);
} catch (error) {
  console.error('ERRO:', error);
} finally {
  await pool.end();
}
