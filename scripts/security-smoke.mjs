const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
let failed = false;

async function check(name, fn) {
  try {
    await fn();
    console.log(`OK  ${name}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

await check('health PostgreSQL', async () => {
  const r = await fetch(`${base}/api/health`);
  const body = await r.json();
  if (!r.ok || body?.status !== 'ok' || body?.database !== 'postgresql') {
    throw new Error(`resposta inesperada: ${r.status} ${JSON.stringify(body)}`);
  }
});

await check('rota admin bloqueada sem login', async () => {
  const r = await fetch(`${base}/api/admin/registrations`, { redirect: 'manual' });
  if (r.status !== 401) throw new Error(`esperado 401, recebido ${r.status}`);
});

await check('headers básicos', async () => {
  const r = await fetch(`${base}/api/health`);
  if (r.headers.get('x-content-type-options') !== 'nosniff') throw new Error('X-Content-Type-Options ausente');
  if (r.headers.get('x-frame-options') !== 'DENY') throw new Error('X-Frame-Options ausente');
});

if (base.startsWith('https://')) {
  await check('headers de produção', async () => {
    const r = await fetch(`${base}/api/health`);
    if (!r.headers.get('strict-transport-security')) throw new Error('HSTS ausente');
    if (!r.headers.get('content-security-policy')) throw new Error('CSP ausente');
  });
}

if (failed) process.exit(1);
console.log('\nSEGURANÇA: smoke test aprovado.');
