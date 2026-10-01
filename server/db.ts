import crypto from 'crypto';
import { pool } from './postgres.js';
import {
  ThemeConfig,
  EventInfo,
  Registration,
  GalleryItem,
  VideoItem,
  TestimonialItem,
  AdminStats,
  PublicData,
} from '../src/types/index.js';

export const DEFAULT_THEME: ThemeConfig = {
  mode: 'light',
  colorPrimary: '#78350f',
  colorSecondary: '#9a3412',
  colorAccent: '#b8860b',
  colorBgMain: '#faf7f2',
  colorBgSecondary: '#f4efea',
  colorTextTitle: '#1c1917',
  colorTextMain: '#292524',
  colorTextSecondary: '#78716c',
  colorButtonBg: '#78350f',
  colorButtonText: '#ffffff',
  colorLink: '#9a3412',
  colorBorder: '#e7e1d8',
  colorCardBg: '#ffffff',
  colorCardBorder: '#ebe5dc',
  colorFormFocus: '#b8860b',
  colorSuccess: '#166534',
  colorWarning: '#b45309',
  colorError: '#991b1b',
};

export const DEFAULT_EVENT_INFO: EventInfo = {
  title: 'Retiro Anual de Mulheres UAMA',
  subtitle: 'Um tempo precioso de renovação espiritual, comunhão e descanso para o coração feminino.',
  themeVerse: 'Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis.',
  themeVerseReference: 'Provérbios 31:10',
  month: 'Setembro',
  duration: '3 dias (Sexta a Domingo)',
  datesText: 'Aguardando informativo oficial',
  isDateConfirmed: false,
  locationName: 'Local a ser confirmado no informativo oficial',
  locationAddress: 'Divulgação em breve',
  isLocationConfirmed: false,
  investmentText: 'Valores e condições de pagamento a serem divulgados no anúncio oficial',
  paymentMethods: 'PIX, Cartão em até 10x e Boleto',
  isInvestmentConfirmed: false,
  lodgingInfo: 'Acomodações acolhedoras em suítes com banheiros privativos, roupas de cama e banho, integradas à natureza.',
  mealsInfo: 'Pensão completa inclusa: café da manhã colonial, almoço com comida caseira selecionada, café da tarde e jantar.',
  scheduleHighlights: [
    { day: 'Sexta-feira', time: '17:00 às 19:30', activity: 'Recepção, Credenciamento e Jantar de Boas-Vindas' },
    { day: 'Sexta-feira', time: '20:00 às 22:00', activity: 'Sessão Solene de Abertura & Louvor de Acolhimento' },
    { day: 'Sábado', time: '08:00 às 09:30', activity: 'Café da Manhã Colonial & Momento Devocional' },
    { day: 'Sábado', time: '10:00 às 12:30', activity: 'Palestra Temática & Dinâmicas de Grupo' },
    { day: 'Sábado', time: '13:00 às 16:30', activity: 'Almoço Especial & Tarde de Descanso e Convivência' },
    { day: 'Sábado', time: '19:30 às 22:00', activity: 'Noite de Avivamento, Testemunhos e Ministrações' },
    { day: 'Domingo', time: '08:30 às 11:30', activity: 'Santa Ceia de Encerramento e Consagração' },
    { day: 'Domingo', time: '12:30 às 14:00', activity: 'Almoço de Confraternização e Abraço de Despedida' },
  ],
  importantNotice: 'Atenção: Os detalhes exatos de data no mês de setembro, localidade e investimento serão confirmados através da imagem do cartaz oficial do retiro. Você já pode registrar sua pré-inscrição abaixo para assegurar prioridade de vaga.',
  contactEmail: 'retiro.mulheres@uama.org.br',
  contactPhone: '(11) 98765-4321',
};

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 210000, 64, 'sha512').toString('hex');
}

function mapRegistration(row: any): Registration {
  return {
    id: row.id,
    protocol: row.protocol,
    fullName: row.full_name,
    birthDate: typeof row.birth_date === 'string' ? row.birth_date : new Date(row.birth_date).toISOString().slice(0, 10),
    phone: row.phone,
    address: row.address,
    rg: row.rg,
    cpf: row.cpf,
    slipperSize: row.slipper_size,
    shirtSize: row.shirt_size,
    acknowledgement: row.acknowledgement,
    status: row.status,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

function mapGallery(row: any): GalleryItem {
  return { id: row.id, url: row.url, title: row.title, category: row.category, isFeatured: row.is_featured, order: row.sort_order };
}

function mapVideo(row: any): VideoItem {
  return { id: row.id, title: row.title, description: row.description, embedUrl: row.embed_url, thumbnailUrl: row.thumbnail_url, duration: row.duration ?? undefined, isActive: row.is_active, order: row.sort_order };
}

function mapTestimonial(row: any): TestimonialItem {
  return { id: row.id, name: row.name, edition: row.edition, quote: row.quote, avatarUrl: row.avatar_url ?? undefined, isActive: row.is_active, order: row.sort_order };
}

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initDatabase(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`CREATE TABLE IF NOT EXISTS admins (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
      await client.query(`CREATE TABLE IF NOT EXISTS admin_sessions (token TEXT PRIMARY KEY, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
      await client.query(`CREATE TABLE IF NOT EXISTS security_rate_limits (bucket_key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, reset_at TIMESTAMPTZ NOT NULL)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_security_rate_limits_reset_at ON security_rate_limits(reset_at)`);
      await client.query(`CREATE TABLE IF NOT EXISTS admin_audit_logs (id BIGSERIAL PRIMARY KEY, actor TEXT NOT NULL DEFAULT 'admin', action TEXT NOT NULL, path TEXT NOT NULL, method TEXT NOT NULL, status_code INTEGER NOT NULL, ip_hash TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC)`);
      await client.query(`CREATE TABLE IF NOT EXISTS registrations (id TEXT PRIMARY KEY, protocol TEXT UNIQUE NOT NULL, full_name TEXT NOT NULL, birth_date DATE NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, rg TEXT NOT NULL, cpf TEXT NOT NULL, slipper_size TEXT NOT NULL, shirt_size TEXT NOT NULL, acknowledgement BOOLEAN NOT NULL DEFAULT FALSE, status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','confirmada','cancelada')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
      await client.query(`CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
      await client.query(`CREATE TABLE IF NOT EXISTS gallery (id TEXT PRIMARY KEY, url TEXT NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL, is_featured BOOLEAN NOT NULL DEFAULT FALSE, sort_order INTEGER NOT NULL DEFAULT 0)`);
      await client.query(`CREATE TABLE IF NOT EXISTS videos (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, embed_url TEXT NOT NULL, thumbnail_url TEXT NOT NULL, duration TEXT, is_active BOOLEAN NOT NULL DEFAULT TRUE, sort_order INTEGER NOT NULL DEFAULT 0)`);
      await client.query(`CREATE TABLE IF NOT EXISTS testimonials (id TEXT PRIMARY KEY, name TEXT NOT NULL, edition TEXT NOT NULL, quote TEXT NOT NULL, avatar_url TEXT, is_active BOOLEAN NOT NULL DEFAULT TRUE, sort_order INTEGER NOT NULL DEFAULT 0)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_registrations_birth_date ON registrations(birth_date)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at)`);
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_active_cpf ON registrations ((regexp_replace(cpf, '\\D', '', 'g'))) WHERE status <> 'cancelada'`);

      await client.query(`INSERT INTO app_settings (key, value) VALUES ('theme', $1::jsonb) ON CONFLICT (key) DO NOTHING`, [JSON.stringify(DEFAULT_THEME)]);
      await client.query(`INSERT INTO app_settings (key, value) VALUES ('eventInfo', $1::jsonb) ON CONFLICT (key) DO NOTHING`, [JSON.stringify(DEFAULT_EVENT_INFO)]);

      const adminCount = await client.query(`SELECT COUNT(*)::int AS count FROM admins`);
      if (adminCount.rows[0].count === 0) {
        const initialPassword = process.env.UAMA_ADMIN_INITIAL_PASSWORD;
        if (!initialPassword || initialPassword.length < 12) {
          throw new Error('Banco sem administrador. Defina UAMA_ADMIN_INITIAL_PASSWORD com pelo menos 12 caracteres para criar o primeiro acesso.');
        }
        const salt = crypto.randomBytes(16).toString('hex');
        await client.query(`INSERT INTO admins (username, password_hash, salt) VALUES ('admin', $1, $2)`, [hashPassword(initialPassword, salt), salt]);
      }

      await client.query(`DELETE FROM admin_sessions WHERE expires_at <= NOW()`);
      await client.query('COMMIT');
      initialized = true;
    } catch (error) {
      await client.query('ROLLBACK');
      initPromise = null;
      throw error;
    } finally {
      client.release();
    }
  })();

  return initPromise;
}

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  await initDatabase();
  const result = await pool.query(`SELECT value FROM app_settings WHERE key = $1`, [key]);
  return result.rows[0]?.value ? ({ ...fallback, ...result.rows[0].value } as T) : fallback;
}

async function setSetting<T>(key: string, value: T): Promise<T> {
  await initDatabase();
  await pool.query(`INSERT INTO app_settings (key, value, updated_at) VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`, [key, JSON.stringify(value)]);
  return value;
}

export async function getPublicData(): Promise<PublicData> {
  await initDatabase();
  const [theme, eventInfo, gallery, videos, testimonials] = await Promise.all([
    getSetting('theme', DEFAULT_THEME),
    getSetting('eventInfo', DEFAULT_EVENT_INFO),
    pool.query(`SELECT * FROM gallery ORDER BY sort_order ASC`),
    pool.query(`SELECT * FROM videos WHERE is_active = TRUE ORDER BY sort_order ASC`),
    pool.query(`SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY sort_order ASC`),
  ]);
  return {
    theme: theme as ThemeConfig,
    eventInfo: eventInfo as EventInfo,
    gallery: gallery.rows.map(mapGallery),
    videos: videos.rows.map(mapVideo),
    testimonials: testimonials.rows.map(mapTestimonial),
  };
}

export async function findActiveRegistrationByCpf(cleanCpf: string): Promise<Registration | null> {
  await initDatabase();
  const result = await pool.query(`SELECT * FROM registrations WHERE regexp_replace(cpf, '\\D', '', 'g') = $1 AND status <> 'cancelada' LIMIT 1`, [cleanCpf]);
  return result.rows[0] ? mapRegistration(result.rows[0]) : null;
}

export async function createRegistration(reg: Registration): Promise<Registration> {
  await initDatabase();
  const result = await pool.query(
    `INSERT INTO registrations (id, protocol, full_name, birth_date, phone, address, rg, cpf, slipper_size, shirt_size, acknowledgement, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [reg.id, reg.protocol, reg.fullName, reg.birthDate, reg.phone, reg.address, reg.rg, reg.cpf, reg.slipperSize, reg.shirtSize, reg.acknowledgement, reg.status, reg.createdAt]
  );
  return mapRegistration(result.rows[0]);
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  await initDatabase();
  const result = await pool.query(`SELECT password_hash, salt FROM admins WHERE username = $1 LIMIT 1`, [username]);
  if (!result.rows[0]) return false;
  const hash = hashPassword(password, result.rows[0].salt);
  const stored = Buffer.from(result.rows[0].password_hash, 'hex');
  const candidate = Buffer.from(hash, 'hex');
  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
}

export async function getAdminUsername(): Promise<string> {
  await initDatabase();
  const result = await pool.query(`SELECT username FROM admins ORDER BY id ASC LIMIT 1`);
  return result.rows[0]?.username ?? 'admin';
}

export async function createAdminSession(): Promise<string> {
  await initDatabase();
  await pool.query(`DELETE FROM admin_sessions WHERE expires_at <= NOW()`);
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query(`INSERT INTO admin_sessions (token, expires_at) VALUES ($1, NOW() + INTERVAL '8 hours')`, [token]);
  return token;
}

export async function isValidSession(token?: string): Promise<boolean> {
  if (!token) return false;
  await initDatabase();
  const result = await pool.query(`SELECT 1 FROM admin_sessions WHERE token = $1 AND expires_at > NOW() LIMIT 1`, [token]);
  return result.rowCount === 1;
}

export async function destroySession(token: string): Promise<void> {
  await initDatabase();
  await pool.query(`DELETE FROM admin_sessions WHERE token = $1`, [token]);
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  await initDatabase();
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(newPassword, salt);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`UPDATE admins SET password_hash = $1, salt = $2`, [passwordHash, salt]);
    await client.query(`DELETE FROM admin_sessions`);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getStats(): Promise<AdminStats> {
  await initDatabase();
  const [regs, gallery, videos, testimonials] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='confirmada')::int AS confirmed, COUNT(*) FILTER (WHERE status='pendente')::int AS pending, COUNT(*) FILTER (WHERE status='cancelada')::int AS cancelled FROM registrations`),
    pool.query(`SELECT COUNT(*)::int AS count FROM gallery`),
    pool.query(`SELECT COUNT(*)::int AS count FROM videos`),
    pool.query(`SELECT COUNT(*)::int AS count FROM testimonials`),
  ]);
  const r = regs.rows[0];
  return { totalRegistrations: r.total, confirmedRegistrations: r.confirmed, pendingRegistrations: r.pending, cancelledRegistrations: r.cancelled, totalGallery: gallery.rows[0].count, totalVideos: videos.rows[0].count, totalTestimonials: testimonials.rows[0].count };
}

export async function listRegistrations(search = '', status = ''): Promise<Registration[]> {
  await initDatabase();
  const params: any[] = [];
  const where: string[] = [];
  if (status && status !== 'todos') { params.push(status); where.push(`status = $${params.length}`); }
  if (search) { params.push(`%${search}%`); const p = `$${params.length}`; where.push(`(LOWER(full_name) LIKE LOWER(${p}) OR cpf LIKE ${p} OR phone LIKE ${p} OR LOWER(protocol) LIKE LOWER(${p}))`); }
  const result = await pool.query(`SELECT * FROM registrations ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC`, params);
  return result.rows.map(mapRegistration);
}

export async function updateRegistrationStatus(id: string, status: Registration['status']): Promise<Registration | null> {
  await initDatabase();
  const result = await pool.query(`UPDATE registrations SET status = $2 WHERE id = $1 RETURNING *`, [id, status]);
  return result.rows[0] ? mapRegistration(result.rows[0]) : null;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  await initDatabase();
  const result = await pool.query(`DELETE FROM registrations WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function updateTheme(newTheme: Partial<ThemeConfig>): Promise<ThemeConfig> {
  const current = await getSetting<ThemeConfig>('theme', DEFAULT_THEME);
  return setSetting('theme', { ...DEFAULT_THEME, ...current, ...newTheme });
}

export async function resetTheme(): Promise<ThemeConfig> { return setSetting('theme', { ...DEFAULT_THEME }); }

export async function updateEventInfo(updates: Partial<EventInfo>): Promise<EventInfo> {
  const current = await getSetting<EventInfo>('eventInfo', DEFAULT_EVENT_INFO);
  return setSetting('eventInfo', { ...current, ...updates });
}

export async function createGalleryItem(input: Omit<GalleryItem, 'id' | 'order'>): Promise<GalleryItem> {
  await initDatabase();
  const max = await pool.query(`SELECT COALESCE(MAX(sort_order),0)::int AS max FROM gallery`);
  const item: GalleryItem = { id: `gal_${Date.now()}`, order: max.rows[0].max + 1, ...input };
  await pool.query(`INSERT INTO gallery (id,url,title,category,is_featured,sort_order) VALUES ($1,$2,$3,$4,$5,$6)`, [item.id,item.url,item.title,item.category,!!item.isFeatured,item.order]);
  return item;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  await initDatabase();
  const current = await pool.query(`SELECT * FROM gallery WHERE id=$1`, [id]);
  if (!current.rows[0]) return null;
  const item = { ...mapGallery(current.rows[0]), ...updates, id };
  await pool.query(`UPDATE gallery SET url=$2,title=$3,category=$4,is_featured=$5,sort_order=$6 WHERE id=$1`, [id,item.url,item.title,item.category,!!item.isFeatured,item.order]);
  return item;
}

export async function deleteGalleryItem(id: string): Promise<boolean> { const r = await pool.query(`DELETE FROM gallery WHERE id=$1`,[id]); return (r.rowCount ?? 0)>0; }

export async function createVideoItem(input: Omit<VideoItem, 'id' | 'order'>): Promise<VideoItem> {
  await initDatabase();
  const max = await pool.query(`SELECT COALESCE(MAX(sort_order),0)::int AS max FROM videos`);
  const item: VideoItem = { id:`vid_${Date.now()}`, order:max.rows[0].max+1, ...input };
  await pool.query(`INSERT INTO videos (id,title,description,embed_url,thumbnail_url,duration,is_active,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [item.id,item.title,item.description,item.embedUrl,item.thumbnailUrl,item.duration ?? null,item.isActive,item.order]);
  return item;
}

export async function updateVideoItem(id:string, updates:Partial<VideoItem>):Promise<VideoItem|null>{
  const current=await pool.query(`SELECT * FROM videos WHERE id=$1`,[id]); if(!current.rows[0]) return null;
  const item={...mapVideo(current.rows[0]),...updates,id};
  await pool.query(`UPDATE videos SET title=$2,description=$3,embed_url=$4,thumbnail_url=$5,duration=$6,is_active=$7,sort_order=$8 WHERE id=$1`,[id,item.title,item.description,item.embedUrl,item.thumbnailUrl,item.duration ?? null,item.isActive,item.order]);
  return item;
}
export async function deleteVideoItem(id:string):Promise<boolean>{const r=await pool.query(`DELETE FROM videos WHERE id=$1`,[id]);return (r.rowCount??0)>0;}

export async function createTestimonialItem(input:Omit<TestimonialItem,'id'|'order'>):Promise<TestimonialItem>{
  await initDatabase(); const max=await pool.query(`SELECT COALESCE(MAX(sort_order),0)::int AS max FROM testimonials`);
  const item:TestimonialItem={id:`test_${Date.now()}`,order:max.rows[0].max+1,...input};
  await pool.query(`INSERT INTO testimonials (id,name,edition,quote,avatar_url,is_active,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)`,[item.id,item.name,item.edition,item.quote,item.avatarUrl ?? null,item.isActive,item.order]); return item;
}
export async function updateTestimonialItem(id:string,updates:Partial<TestimonialItem>):Promise<TestimonialItem|null>{
  const current=await pool.query(`SELECT * FROM testimonials WHERE id=$1`,[id]); if(!current.rows[0]) return null;
  const item={...mapTestimonial(current.rows[0]),...updates,id};
  await pool.query(`UPDATE testimonials SET name=$2,edition=$3,quote=$4,avatar_url=$5,is_active=$6,sort_order=$7 WHERE id=$1`,[id,item.name,item.edition,item.quote,item.avatarUrl ?? null,item.isActive,item.order]); return item;
}
export async function deleteTestimonialItem(id:string):Promise<boolean>{const r=await pool.query(`DELETE FROM testimonials WHERE id=$1`,[id]);return (r.rowCount??0)>0;}


export interface AdminAuditInput {
  actor?: string;
  action: string;
  path: string;
  method: string;
  statusCode: number;
  ipHash?: string | null;
}

export async function logAdminAudit(input: AdminAuditInput): Promise<void> {
  await initDatabase();
  await pool.query(
    `INSERT INTO admin_audit_logs (actor, action, path, method, status_code, ip_hash) VALUES ($1, $2, $3, $4, $5, $6)`,
    [input.actor || 'admin', input.action, input.path, input.method, input.statusCode, input.ipHash || null]
  );
}

export async function listAdminAuditLogs(limit = 100): Promise<any[]> {
  await initDatabase();
  const safeLimit = Math.max(1, Math.min(500, Number(limit) || 100));
  const result = await pool.query(
    `SELECT id, actor, action, path, method, status_code, created_at FROM admin_audit_logs ORDER BY created_at DESC LIMIT $1`,
    [safeLimit]
  );
  return result.rows;
}
