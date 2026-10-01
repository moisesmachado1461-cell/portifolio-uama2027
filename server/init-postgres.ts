import { initDatabase } from './db.js';
import { pool } from './postgres.js';
try {
  await initDatabase();
  console.log('BANCO UAMA INICIALIZADO COM SUCESSO');
  console.log('Tabelas PostgreSQL criadas/verificadas.');
} catch (error) {
  console.error('ERRO AO INICIALIZAR O POSTGRESQL');
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
