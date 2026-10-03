import 'dotenv/config';
import crypto from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  getPublicData,
  findActiveRegistrationByCpf,
  createRegistration,
  verifyAdminCredentials,
  createAdminSession,
  isValidSession,
  destroySession,
  updateAdminPassword,
  getAdminUsername,
  getStats,
  listRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  updateTheme,
  resetTheme,
  updateEventInfo,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  createVideoItem,
  updateVideoItem,
  deleteVideoItem,
  createTestimonialItem,
  updateTestimonialItem,
  deleteTestimonialItem,
  logAdminAudit,
  listAdminAuditLogs,
} from './server/db.js';
import { pool } from './server/postgres.js';
import { persistentRateLimit, requireSameOrigin } from './server/security.js';
import { isValidCPF, isValidPhone } from './src/utils/validation.js';
import { Registration } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';
const ADMIN_SESSION_COOKIE = 'uama_admin_session';
const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function getCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
}

function setAdminSessionCookie(res: Response, token: string): void {
  const secure = isProduction ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${ADMIN_SESSION_MAX_AGE_SECONDS}${secure}`
  );
}

function clearAdminSessionCookie(res: Response): void {
  const secure = isProduction ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_SESSION_COOKIE}=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
  );
}

app.set('trust proxy', 1);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  if (req.path.startsWith('/api/admin')) {
    res.setHeader('Cache-Control', 'no-store, private');
  }
  if (isProduction) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; form-action 'self'; upgrade-insecure-requests"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

async function requireAdminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = getCookie(req, ADMIN_SESSION_COOKIE);
    if (!token || !(await isValidSession(token))) {
      clearAdminSessionCookie(res);
      res.status(401).json({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
      return;
    }
    next();
  } catch (error) {
    console.error('Erro ao validar sessão:', error);
    res.status(500).json({ error: 'Falha ao validar a sessão.' });
  }
}


app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'postgresql' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.get('/api/public-data', async (_req: Request, res: Response) => {
  try {
    res.json(await getPublicData());
  } catch (error) {
    console.error('Erro ao carregar dados públicos:', error);
    res.status(500).json({ error: 'Erro ao carregar dados públicos.' });
  }
});

app.post('/api/register', persistentRateLimit('public-register', 8, 15 * 60), async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, birthDate, phone, address, rg, cpf, slipperSize, shirtSize, acknowledgement } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      res.status(400).json({ error: 'Por favor, informe seu nome completo (mínimo de 3 caracteres).' }); return;
    }
    if (!cpf || !isValidCPF(cpf)) { res.status(400).json({ error: 'CPF inválido. Verifique os números informados.' }); return; }
    if (!phone || !isValidPhone(phone)) { res.status(400).json({ error: 'Número de telefone inválido. Informe o DDD e o número completo.' }); return; }
    if (!birthDate || typeof birthDate !== 'string' || Number.isNaN(Date.parse(birthDate))) { res.status(400).json({ error: 'Data de nascimento inválida.' }); return; }

    const birth = new Date(`${birthDate}T12:00:00`);
    const today = new Date();
    if (birth > today || birth.getFullYear() < 1900) { res.status(400).json({ error: 'Data de nascimento fora do intervalo permitido.' }); return; }
    if (!address || typeof address !== 'string' || address.trim().length < 8 || address.trim().length > 250) { res.status(400).json({ error: 'Informe um endereço completo válido.' }); return; }
    if (!rg || typeof rg !== 'string' || rg.trim().length < 5 || rg.trim().length > 30) { res.status(400).json({ error: 'RG inválido.' }); return; }
    if (!slipperSize || typeof slipperSize !== 'string' || !/^[0-9]{2}$/.test(slipperSize.trim())) { res.status(400).json({ error: 'Número do chinelo inválido.' }); return; }
    if (!shirtSize || typeof shirtSize !== 'string' || shirtSize.trim().length > 10) { res.status(400).json({ error: 'Tamanho da camisa inválido.' }); return; }
    if (acknowledgement !== true) { res.status(400).json({ error: 'É necessário confirmar a ciência sobre a política de desistência.' }); return; }

    const cleanCPF = cpf.replace(/\D/g, '');
    const existing = await findActiveRegistrationByCpf(cleanCPF);
    if (existing) {
      res.status(409).json({
        error: `Já existe uma inscrição ativa para este CPF (Protocolo: ${existing.protocol}). Entre em contato com a coordenação caso precise atualizar dados.`,
        protocol: existing.protocol,
      });
      return;
    }

    const cleanCpfFormatted = `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9, 11)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const protocol = `UAMA-${new Date().getFullYear()}-${randomSuffix}`;

    const newRegistration: Registration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      protocol,
      fullName: fullName.trim(),
      birthDate,
      phone: phone.trim(),
      address: address.trim(),
      rg: rg.trim(),
      cpf: cleanCpfFormatted,
      slipperSize: slipperSize.trim(),
      shirtSize: shirtSize.trim().toUpperCase(),
      acknowledgement: true,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    const saved = await createRegistration(newRegistration);
    res.setHeader('Cache-Control', 'no-store, private');
    res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso!',
      registration: {
        id: saved.id,
        protocol: saved.protocol,
        fullName: saved.fullName,
        status: saved.status,
        createdAt: saved.createdAt,
      },
    });
  } catch (error: any) {
    if (error?.code === '23505') {
      res.status(409).json({ error: 'Já existe uma inscrição ativa para este CPF ou protocolo.' });
      return;
    }
    console.error('Erro ao registrar inscrição:', error);
    res.status(500).json({ error: 'Falha interna ao processar a inscrição. Tente novamente.' });
  }
});


// Proteção centralizada: toda a área administrativa passa pela mesma política.
app.use('/api/admin', requireSameOrigin);
app.use('/api/admin', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.path === '/login' || req.path === '/logout') {
    next();
    return;
  }
  await requireAdminAuth(req, res, next);
});

// Auditoria administrativa: registra a ação, mas nunca o corpo da requisição.
app.use('/api/admin', (req: Request, res: Response, next: NextFunction) => {
  const shouldAudit = !['GET', 'HEAD', 'OPTIONS'].includes(req.method) || req.path === '/check-auth';
  if (!shouldAudit) { next(); return; }

  res.on('finish', () => {
    const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex');
    void logAdminAudit({
      actor: 'admin',
      action: `${req.method} ${req.path}`,
      path: req.originalUrl.split('?')[0],
      method: req.method,
      statusCode: res.statusCode,
      ipHash,
    }).catch((error) => console.error('Falha ao gravar auditoria administrativa:', error));
  });
  next();
});

app.get('/api/admin/audit-logs', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : 100;
    res.json(await listAdminAuditLogs(limit));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao carregar auditoria.' });
  }
});

app.post('/api/admin/login', persistentRateLimit('admin-login', 5, 15 * 60), async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) { res.status(400).json({ error: 'Usuário e senha são obrigatórios.' }); return; }
    if (await verifyAdminCredentials(username.trim(), password)) {
      const token = await createAdminSession();
      setAdminSessionCookie(res, token);
      // O valor abaixo é apenas um marcador de interface; o segredo real fica em cookie HttpOnly.
      res.json({ success: true, token: 'session-cookie', username: username.trim() });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas. Verifique usuário e senha.' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Falha interna no login.' });
  }
});

app.post('/api/admin/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = getCookie(req, ADMIN_SESSION_COOKIE);
    if (token) await destroySession(token);
  } catch (error) {
    console.error('Erro ao encerrar sessão:', error);
  } finally {
    clearAdminSessionCookie(res);
    res.json({ success: true, message: 'Sessão encerrada com sucesso.' });
  }
});

app.get('/api/admin/check-auth', async (_req, res) => {
  res.json({ valid: true, username: await getAdminUsername() });
});

app.get('/api/admin/stats', async (_req, res) => {
  try { res.json(await getStats()); } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao carregar estatísticas.' }); }
});

app.get('/api/admin/registrations', async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    res.json(await listRegistrations(search, status));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao carregar inscrições.' }); }
});

app.patch('/api/admin/registrations/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['pendente', 'confirmada', 'cancelada'].includes(status)) { res.status(400).json({ error: 'Status inválido.' }); return; }
    const reg = await updateRegistrationStatus(req.params.id, status);
    if (!reg) { res.status(404).json({ error: 'Inscrição não encontrada.' }); return; }
    res.json({ success: true, registration: reg });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao atualizar inscrição.' }); }
});

app.delete('/api/admin/registrations/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!(await deleteRegistration(req.params.id))) { res.status(404).json({ error: 'Inscrição não encontrada.' }); return; }
    res.json({ success: true, message: 'Inscrição excluída com sucesso.' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao excluir inscrição.' }); }
});

app.put('/api/admin/theme', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== 'object') { res.status(400).json({ error: 'Dados do tema inválidos.' }); return; }
    const theme = await updateTheme(req.body);
    res.json({ success: true, theme });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao salvar tema.' }); }
});

app.post('/api/admin/theme/reset', async (_req, res) => {
  try { const theme = await resetTheme(); res.json({ success: true, theme }); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao restaurar tema.' }); }
});

app.put('/api/admin/event-info', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== 'object') { res.status(400).json({ error: 'Dados do evento inválidos.' }); return; }
    const eventInfo = await updateEventInfo(req.body);
    res.json({ success: true, eventInfo });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao salvar informações do evento.' }); }
});

app.post('/api/admin/gallery', async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, title, category, isFeatured } = req.body;
    if (!url) { res.status(400).json({ error: 'URL ou imagem é obrigatória.' }); return; }
    res.status(201).json(await createGalleryItem({ url, title: title || 'Momento do Retiro UAMA', category: category || 'Geral', isFeatured: !!isFeatured }));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao adicionar item à galeria.' }); }
});

app.put('/api/admin/gallery/:id', async (req: Request, res: Response): Promise<void> => {
  try { const item = await updateGalleryItem(req.params.id, req.body); if (!item) { res.status(404).json({ error: 'Item da galeria não encontrado.' }); return; } res.json(item); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao atualizar galeria.' }); }
});
app.delete('/api/admin/gallery/:id', async (req, res) => { try { await deleteGalleryItem(req.params.id); res.json({ success: true }); } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao excluir item.' }); } });

app.post('/api/admin/videos', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, embedUrl, thumbnailUrl, duration, isActive } = req.body;
    if (!title || !embedUrl) { res.status(400).json({ error: 'Título e URL do vídeo são obrigatórios.' }); return; }
    res.status(201).json(await createVideoItem({ title, description: description || '', embedUrl, thumbnailUrl: thumbnailUrl || '', duration: duration || '03:00', isActive: isActive !== false }));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao adicionar vídeo.' }); }
});
app.put('/api/admin/videos/:id', async (req: Request, res: Response): Promise<void> => { try { const item = await updateVideoItem(req.params.id, req.body); if (!item) { res.status(404).json({ error: 'Vídeo não encontrado.' }); return; } res.json(item); } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao atualizar vídeo.' }); } });
app.delete('/api/admin/videos/:id', async (req, res) => { try { await deleteVideoItem(req.params.id); res.json({ success: true }); } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao excluir vídeo.' }); } });

app.post('/api/admin/testimonials', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, edition, quote, avatarUrl, isActive } = req.body;
    if (!name || !quote) { res.status(400).json({ error: 'Nome e depoimento são obrigatórios.' }); return; }
    res.status(201).json(await createTestimonialItem({ name, edition: edition || 'Participante', quote, avatarUrl: avatarUrl || '', isActive: isActive !== false }));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao adicionar depoimento.' }); }
});
app.put('/api/admin/testimonials/:id', async (req: Request, res: Response): Promise<void> => { try { const item = await updateTestimonialItem(req.params.id, req.body); if (!item) { res.status(404).json({ error: 'Depoimento não encontrado.' }); return; } res.json(item); } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao atualizar depoimento.' }); } });
app.delete('/api/admin/testimonials/:id', async (req, res) => { try { await deleteTestimonialItem(req.params.id); res.json({ success: true }); } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao excluir depoimento.' }); } });

app.put('/api/admin/change-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const username = await getAdminUsername();
    if (!(await verifyAdminCredentials(username, currentPassword))) { res.status(400).json({ error: 'A senha atual informada está incorreta.' }); return; }
    if (!newPassword || newPassword.length < 12) { res.status(400).json({ error: 'A nova senha deve ter no mínimo 12 caracteres.' }); return; }
    await updateAdminPassword(newPassword);
    clearAdminSessionCookie(res);
    res.json({ success: true, message: 'Senha atualizada. Por segurança, faça login novamente.' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Erro ao alterar senha.' }); }
});

async function startServer() {
  await initDatabase();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, watch: { ignored: ['**/data/**'] } },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => res.sendFile(path.resolve(distPath, 'index.html')));
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
    console.log('Database: PostgreSQL');
  });

  const shutdown = async () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
