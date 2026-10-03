const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
let failed = false;

async function check(name, fn) {
  try {
    await fn();
    console.log(`OK  ${name}`);
  } catch (e) {
    failed = true;
    console.error(`FAIL ${name}: ${e.message}`);
  }
}

await check('site público disponível', async () => {
  const r = await fetch(`${base}/`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
});

await check('área admin disponível e não indexável', async () => {
  const r = await fetch(`${base}/admin`, { redirect: 'manual' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const robots = r.headers.get('x-robots-tag') || '';
  if (!robots.toLowerCase().includes('noindex')) throw new Error('X-Robots-Tag sem noindex');
});

await check('API admin continua bloqueada sem login', async () => {
  const r = await fetch(`${base}/api/admin/registrations`);
  if (![401, 403].includes(r.status)) throw new Error(`esperado 401/403, veio ${r.status}`);
});

if (failed) process.exit(1);
console.log('SEPARAÇÃO: smoke test aprovado.');
