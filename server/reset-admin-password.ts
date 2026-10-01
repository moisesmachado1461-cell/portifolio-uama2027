import crypto from 'crypto';
import { pool } from './postgres.js';

const newPassword = process.argv[2];

if (!newPassword || newPassword.length < 12) {
  console.error('Informe uma senha com pelo menos 12 caracteres.');
  process.exit(1);
}

function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 210000, 64, 'sha512')
    .toString('hex');
}

try {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(newPassword, salt);

  await pool.query(
    `
    UPDATE admins
    SET password_hash = $1,
        salt = $2
    WHERE username = 'admin'
    `,
    [passwordHash, salt]
  );

  await pool.query('DELETE FROM admin_sessions');

  console.log('SENHA DO ADMIN ALTERADA COM SUCESSO');
} catch (error) {
  console.error('ERRO AO ALTERAR SENHA');
  console.error(error);
} finally {
  await pool.end();
}
