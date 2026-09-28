import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  saveDatabase,
  verifyAdminCredentials,
  createAdminSession,
  isValidSession,
  destroySession,
  updateAdminPassword,
  getStats,
  DEFAULT_THEME,
} from './server/db.js';
import { isValidCPF, isValidPhone } from './src/utils/validation.js';
import { Registration, GalleryItem, VideoItem, TestimonialItem } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Body parsing with support for image upload as base64
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize DB on boot
initDatabase();

// Auth Middleware for protected admin routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Acesso não autorizado. Faça login novamente.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!isValidSession(token)) {
    res.status(401).json({ error: 'Sessão expirada ou inválida.' });
    return;
  }
  next();
}

// ---------------- PUBLIC API ENDPOINTS ---------------- //

// GET /api/public-data
app.get('/api/public-data', (_req: Request, res: Response) => {
  try {
    const db = initDatabase();
    const currentTheme = { ...DEFAULT_THEME, ...(db.theme || {}) };
    res.json({
      theme: currentTheme,
      eventInfo: db.eventInfo,
      gallery: (db.gallery || []).sort((a, b) => a.order - b.order),
      videos: (db.videos || []).filter(v => v.isActive).sort((a, b) => a.order - b.order),
      testimonials: (db.testimonials || []).filter(t => t.isActive).sort((a, b) => a.order - b.order),
    });
  } catch {
    res.status(500).json({ error: 'Erro ao carregar dados públicos.' });
  }
});

// POST /api/register
app.post('/api/register', (req: Request, res: Response): void => {
  try {
    const { fullName, cpf, phone, notes } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      res.status(400).json({ error: 'Por favor, informe seu nome completo (mínimo de 3 caracteres).' });
      return;
    }

    if (!cpf || !isValidCPF(cpf)) {
      res.status(400).json({ error: 'CPF inválido. Verifique os números informados.' });
      return;
    }

    if (!phone || !isValidPhone(phone)) {
      res.status(400).json({ error: 'Número de telefone inválido. Informe o DDD e o número completo.' });
      return;
    }

    const cleanCPF = cpf.replace(/\D/g, '');
    const db = initDatabase();

    // Prevent duplicate active registration
    const existing = db.registrations.find(
      r => r.cpf.replace(/\D/g, '') === cleanCPF && r.status !== 'cancelada'
    );

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
      cpf: cleanCpfFormatted,
      phone: phone.trim(),
      notes: notes ? String(notes).trim() : '',
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    db.registrations.unshift(newRegistration);
    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso!',
      registration: newRegistration,
    });
  } catch {
    res.status(500).json({ error: 'Falha interna ao processar a inscrição. Tente novamente.' });
  }
});

// ---------------- ADMIN AUTH ENDPOINTS ---------------- //

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    return;
  }

  if (verifyAdminCredentials(username.trim(), password)) {
    const token = createAdminSession();
    res.json({
      success: true,
      token,
      username: username.trim(),
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas. Verifique usuário e senha.' });
  }
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    destroySession(token);
  }
  res.json({ success: true, message: 'Sessão encerrada com sucesso.' });
});

// GET /api/admin/check-auth
app.get('/api/admin/check-auth', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ valid: true });
});

// ---------------- ADMIN DATA & MANAGEMENT ENDPOINTS ---------------- //

// GET /api/admin/stats
app.get('/api/admin/stats', requireAdminAuth, (_req: Request, res: Response) => {
  const stats = getStats();
  res.json(stats);
});

// GET /api/admin/registrations
app.get('/api/admin/registrations', requireAdminAuth, (req: Request, res: Response) => {
  const db = initDatabase();
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase().trim() : '';
  const statusFilter = typeof req.query.status === 'string' ? req.query.status : '';

  let list = db.registrations || [];

  if (statusFilter && statusFilter !== 'todos') {
    list = list.filter(r => r.status === statusFilter);
  }

  if (search) {
    list = list.filter(r =>
      r.fullName.toLowerCase().includes(search) ||
      r.cpf.includes(search) ||
      r.phone.includes(search) ||
      r.protocol.toLowerCase().includes(search)
    );
  }

  res.json(list);
});

// PATCH /api/admin/registrations/:id/status
app.patch('/api/admin/registrations/:id/status', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pendente', 'confirmada', 'cancelada'].includes(status)) {
    res.status(400).json({ error: 'Status inválido.' });
    return;
  }

  const db = initDatabase();
  const reg = db.registrations.find(r => r.id === id);
  if (!reg) {
    res.status(404).json({ error: 'Inscrição não encontrada.' });
    return;
  }

  reg.status = status;
  saveDatabase(db);
  res.json({ success: true, registration: reg });
});

// DELETE /api/admin/registrations/:id
app.delete('/api/admin/registrations/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = initDatabase();
  const initialLength = db.registrations.length;
  db.registrations = db.registrations.filter(r => r.id !== id);

  if (db.registrations.length === initialLength) {
    res.status(404).json({ error: 'Inscrição não encontrada.' });
    return;
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Inscrição excluída com sucesso.' });
});

// PUT /api/admin/theme
app.put('/api/admin/theme', requireAdminAuth, (req: Request, res: Response): void => {
  const newTheme = req.body;
  if (!newTheme || typeof newTheme !== 'object') {
    res.status(400).json({ error: 'Dados do tema inválidos.' });
    return;
  }

  const db = initDatabase();
  db.theme = { ...DEFAULT_THEME, ...newTheme };
  saveDatabase(db);
  res.json({ success: true, theme: db.theme });
});

// POST /api/admin/theme/reset
app.post('/api/admin/theme/reset', requireAdminAuth, (_req: Request, res: Response) => {
  const db = initDatabase();
  db.theme = { ...DEFAULT_THEME };
  saveDatabase(db);
  res.json({ success: true, theme: db.theme });
});

// PUT /api/admin/event-info
app.put('/api/admin/event-info', requireAdminAuth, (req: Request, res: Response): void => {
  const updatedInfo = req.body;
  if (!updatedInfo || typeof updatedInfo !== 'object') {
    res.status(400).json({ error: 'Dados do evento inválidos.' });
    return;
  }

  const db = initDatabase();
  db.eventInfo = { ...db.eventInfo, ...updatedInfo };
  saveDatabase(db);
  res.json({ success: true, eventInfo: db.eventInfo });
});

// GALLERY CRUD
app.post('/api/admin/gallery', requireAdminAuth, (req: Request, res: Response): void => {
  const { url, title, category, isFeatured } = req.body;
  if (!url) {
    res.status(400).json({ error: 'URL ou imagem é obrigatória.' });
    return;
  }

  const db = initDatabase();
  const newItem: GalleryItem = {
    id: `gal_${Date.now()}`,
    url,
    title: title || 'Momento do Retiro UAMA',
    category: category || 'Geral',
    isFeatured: !!isFeatured,
    order: (db.gallery?.length || 0) + 1,
  };

  db.gallery = db.gallery || [];
  db.gallery.push(newItem);
  saveDatabase(db);
  res.status(201).json(newItem);
});

app.put('/api/admin/gallery/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;
  const db = initDatabase();
  const item = db.gallery.find(g => g.id === id);
  if (!item) {
    res.status(404).json({ error: 'Item da galeria não encontrado.' });
    return;
  }

  Object.assign(item, updates);
  saveDatabase(db);
  res.json(item);
});

app.delete('/api/admin/gallery/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = initDatabase();
  db.gallery = (db.gallery || []).filter(g => g.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// VIDEOS CRUD
app.post('/api/admin/videos', requireAdminAuth, (req: Request, res: Response): void => {
  const { title, description, embedUrl, thumbnailUrl, duration, isActive } = req.body;
  if (!title || !embedUrl) {
    res.status(400).json({ error: 'Título e URL do vídeo são obrigatórios.' });
    return;
  }

  const db = initDatabase();
  const newVideo: VideoItem = {
    id: `vid_${Date.now()}`,
    title,
    description: description || '',
    embedUrl,
    thumbnailUrl: thumbnailUrl || '',
    duration: duration || '03:00',
    isActive: isActive !== false,
    order: (db.videos?.length || 0) + 1,
  };

  db.videos = db.videos || [];
  db.videos.push(newVideo);
  saveDatabase(db);
  res.status(201).json(newVideo);
});

app.put('/api/admin/videos/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;
  const db = initDatabase();
  const item = db.videos.find(v => v.id === id);
  if (!item) {
    res.status(404).json({ error: 'Vídeo não encontrado.' });
    return;
  }

  Object.assign(item, updates);
  saveDatabase(db);
  res.json(item);
});

app.delete('/api/admin/videos/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = initDatabase();
  db.videos = (db.videos || []).filter(v => v.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// TESTIMONIALS CRUD
app.post('/api/admin/testimonials', requireAdminAuth, (req: Request, res: Response): void => {
  const { name, edition, quote, avatarUrl, isActive } = req.body;
  if (!name || !quote) {
    res.status(400).json({ error: 'Nome e depoimento são obrigatórios.' });
    return;
  }

  const db = initDatabase();
  const newTestimonial: TestimonialItem = {
    id: `test_${Date.now()}`,
    name,
    edition: edition || 'Participante',
    quote,
    avatarUrl: avatarUrl || '',
    isActive: isActive !== false,
    order: (db.testimonials?.length || 0) + 1,
  };

  db.testimonials = db.testimonials || [];
  db.testimonials.push(newTestimonial);
  saveDatabase(db);
  res.status(201).json(newTestimonial);
});

app.put('/api/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;
  const db = initDatabase();
  const item = db.testimonials.find(t => t.id === id);
  if (!item) {
    res.status(404).json({ error: 'Depoimento não encontrado.' });
    return;
  }

  Object.assign(item, updates);
  saveDatabase(db);
  res.json(item);
});

app.delete('/api/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const db = initDatabase();
  db.testimonials = (db.testimonials || []).filter(t => t.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// PUT /api/admin/change-password
app.put('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response): void => {
  const { currentPassword, newPassword } = req.body;
  const db = initDatabase();

  if (!verifyAdminCredentials(db.admin.username, currentPassword)) {
    res.status(400).json({ error: 'A senha atual informada está incorreta.' });
    return;
  }

  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
    return;
  }

  updateAdminPassword(newPassword);
  res.json({ success: true, message: 'Senha atualizada com sucesso.' });
});

// GET /api/download-project: downloads a clean zip of the project source code
app.get('/api/download-project', (req: Request, res: Response): void => {
  const zipPath = path.resolve(process.cwd(), 'retiro-mulheres-uama-codigo-fonte.zip');
  try {
    const pythonScript = `
import os, zipfile
exclude_dirs = {'node_modules', 'dist', '.git', '.aistudio', '__pycache__'}
with zipfile.ZipFile('${zipPath}', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.zip') or file.endswith('.tar.gz'): continue
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, '.')
            zipf.write(file_path, arcname)
`;
    execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, { cwd: process.cwd() });

    res.download(zipPath, 'retiro-mulheres-uama-codigo-fonte.zip', (err) => {
      if (err) console.error('Error sending zip:', err);
      try {
        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
      } catch {}
    });
  } catch (err) {
    console.error('Failed to create zip', err);
    res.status(500).json({ error: 'Erro ao gerar arquivo zip do projeto.' });
  }
});

// ---------------- VITE MIDDLEWARE / STATIC ASSETS ---------------- //

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
