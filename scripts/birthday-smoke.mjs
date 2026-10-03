import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Este script é executado via tsx para importar o arquivo TypeScript.
const mod = await import(pathToFileURL(path.resolve('src/utils/birthday.ts')).href);
const { isBirthdayToday, calculateAge } = mod;

const today = new Date(2026, 9, 3, 12, 0, 0); // 03/10/2026 em horário local

assert.equal(isBirthdayToday('2000-10-03', today), true, '03/10 deve ser aniversário em 03/10');
assert.equal(isBirthdayToday('2000-10-02', today), false, '02/10 não deve aparecer em 03/10');
assert.equal(isBirthdayToday('2000-10-04', today), false, '04/10 não deve aparecer em 03/10');
assert.equal(isBirthdayToday('2000-10-03T00:00:00.000Z', today), true, 'timestamp ISO deve preservar a data de cadastro');
assert.equal(calculateAge('2000-10-03', today), 26, 'idade no dia do aniversário deve estar correta');
assert.equal(calculateAge('2000-10-04', today), 25, 'idade antes do aniversário deve estar correta');

console.log('OK  aniversário usa a data do cadastro sem deslocamento de fuso');
console.log('OK  idade calculada corretamente');
console.log('ANIVERSÁRIO: smoke test aprovado.');
