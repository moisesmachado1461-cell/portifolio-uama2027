import { pool } from './postgres.js';
try {
  const result = await pool.query('SELECT NOW() AS server_time, current_database() AS database_name');
  console.log('POSTGRESQL CONECTADO COM SUCESSO');
  console.log('Banco:', result.rows[0].database_name);
  console.log('Horário do servidor:', result.rows[0].server_time);
} catch (error) {
  console.error('ERRO AO CONECTAR AO POSTGRESQL');
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
