const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');

async function get(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    return await fetch(`${base}${path}`, { signal: controller.signal, headers: { 'cache-control': 'no-cache' } });
  } finally {
    clearTimeout(timeout);
  }
}

let failed = false;

try {
  const health = await get('/api/health');
  const h = await health.json();
  if (health.ok && h.status === 'ok' && h.database === 'postgresql') {
    console.log(`OK  health PostgreSQL (${h.dbLatencyMs ?? '?'} ms)`);
  } else {
    failed = true;
    console.log('FAIL health PostgreSQL', health.status, h);
  }

  const ready = await get('/api/ready');
  const r = await ready.json();
  if (ready.ok && r.ready === true) console.log('OK  aplicação pronta para tráfego');
  else { failed = true; console.log('FAIL readiness', ready.status, r); }

  const missing = await get('/api/rota-que-nao-existe');
  if (missing.status === 404) console.log('OK  API desconhecida retorna 404 controlado');
  else { failed = true; console.log('FAIL API 404 controlado', missing.status); }

  const requestId = health.headers.get('x-request-id');
  if (requestId) console.log('OK  X-Request-Id presente');
  else { failed = true; console.log('FAIL X-Request-Id ausente'); }
} catch (error) {
  failed = true;
  console.log('FAIL monitoramento:', error?.message || error);
}

if (failed) process.exit(1);
console.log('MONITORAMENTO: teste aprovado.');
