import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ThemeConfig, EventInfo, Registration, GalleryItem, VideoItem, TestimonialItem, AdminStats } from '../src/types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  admin: {
    username: string;
    passwordHash: string;
    salt: string;
  };
  sessions: string[];
  theme: ThemeConfig;
  eventInfo: EventInfo;
  registrations: Registration[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  testimonials: TestimonialItem[];
}

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
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      // Fallback if corrupt
    }
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword('admin123', salt);

  const initialDb: DatabaseSchema = {
    admin: {
      username: 'admin',
      passwordHash,
      salt,
    },
    sessions: [],
    theme: DEFAULT_THEME,
    eventInfo: DEFAULT_EVENT_INFO,
    registrations: [
      {
        id: 'reg_sample_1',
        protocol: 'UAMA-2026-0842',
        fullName: 'Luciana Ferreira de Albuquerque',
        cpf: '342.198.708-45',
        phone: '(11) 98124-5532',
        notes: 'Vegetariana, necessita de quarto no piso térreo.',
        status: 'confirmada',
        createdAt: '2026-09-20T14:30:00.000Z',
      },
      {
        id: 'reg_sample_2',
        protocol: 'UAMA-2026-0843',
        fullName: 'Priscila Rocha dos Santos',
        cpf: '451.872.903-12',
        phone: '(11) 99876-1234',
        notes: 'Primeira vez participando do retiro.',
        status: 'pendente',
        createdAt: '2026-09-22T09:15:00.000Z',
      },
      {
        id: 'reg_sample_3',
        protocol: 'UAMA-2026-0844',
        fullName: 'Cláudia Mendes Guimarães',
        cpf: '230.941.658-90',
        phone: '(11) 97654-8899',
        notes: '',
        status: 'pendente',
        createdAt: '2026-09-24T18:45:00.000Z',
      },
    ],
    gallery: [
      {
        id: 'gal_1',
        url: '/src/assets/images/hero_women_retreat_1790618255314.jpg',
        title: 'Círculo de Oração e Comunhão',
        category: 'Comunhão',
        isFeatured: true,
        order: 1,
      },
      {
        id: 'gal_2',
        url: '/src/assets/images/about_retreat_moment_1790618270317.jpg',
        title: 'Ministração e Diálogo no Pavilhão',
        category: 'Palestras',
        isFeatured: false,
        order: 2,
      },
      {
        id: 'gal_3',
        url: '/src/assets/images/experience_worship_nature_1790618284648.jpg',
        title: 'Reflexão Matinal ao Ar Livre',
        category: 'Espiritualidade',
        isFeatured: false,
        order: 3,
      },
      {
        id: 'gal_4',
        url: '/src/assets/images/gallery_fellowship_table_1790618297205.jpg',
        title: 'Banquete de Confraternização',
        category: 'Momentos',
        isFeatured: false,
        order: 4,
      },
    ],
    videos: [
      {
        id: 'vid_1',
        title: 'Melhores Momentos — Retiro de Mulheres UAMA',
        description: 'Assista a um resumo emocionante da última edição do nosso retiro: ministrações, lágrimas de alegria e comunhão profunda.',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '/src/assets/images/about_retreat_moment_1790618270317.jpg',
        duration: '04:12',
        isActive: true,
        order: 1,
      },
      {
        id: 'vid_2',
        title: 'Mensagem Especial de Boas-Vindas da Coordenação',
        description: 'Um convite carinhoso da equipe de liderança do Retiro UAMA para todas as mulheres que buscam renovo e descanso.',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: '/src/assets/images/hero_women_retreat_1790618255314.jpg',
        duration: '02:45',
        isActive: true,
        order: 2,
      },
    ],
    testimonials: [
      {
        id: 'test_1',
        name: 'Mariana Duarte',
        edition: 'Retiro Edição Anterior',
        quote: 'Cheguei ao retiro com a alma exausta pelas pressões da rotina e das responsabilidades. Foram três dias em que me senti verdadeiramente acolhida, ouvida por Deus e cercada de irmãs amorosas. Voltei restaurada e cheia de paz.',
        avatarUrl: '',
        isActive: true,
        order: 1,
      },
      {
        id: 'test_2',
        name: 'Renata Vasconcelos',
        edition: 'Participante há 3 anos',
        quote: 'O Retiro de Mulheres UAMA não é apenas um evento no calendário: é um marco anual de renovação na minha vida. O carinho nos detalhes, a qualidade da alimentação, a espiritualidade genuína... É simplesmente inesquecível.',
        avatarUrl: '',
        isActive: true,
        order: 2,
      },
      {
        id: 'test_3',
        name: 'Débora Silveira',
        edition: 'Primeira Participação',
        quote: 'Nunca tinha participado de nada semelhante e estava apreensiva por não conhecer quase ninguém. Desde o primeiro abraço na recepção, me senti em casa. As palestras falaram diretamente às dores mais profundas do meu coração.',
        avatarUrl: '',
        isActive: true,
        order: 3,
      },
    ],
  };

  saveDatabase(initialDb);
  return initialDb;
}

export function saveDatabase(data: DatabaseSchema): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function verifyAdminCredentials(username: string, password: string):boolean {
  const db = initDatabase();
  if (db.admin.username !== username) return false;
  const hash = hashPassword(password, db.admin.salt);
  return hash === db.admin.passwordHash;
}

export function createAdminSession(): string {
  const db = initDatabase();
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions.push(token);
  saveDatabase(db);
  return token;
}

export function isValidSession(token?: string): boolean {
  if (!token) return false;
  const db = initDatabase();
  return db.sessions.includes(token);
}

export function destroySession(token: string): void {
  const db = initDatabase();
  db.sessions = db.sessions.filter(s => s !== token);
  saveDatabase(db);
}

export function updateAdminPassword(newPassword: string): void {
  const db = initDatabase();
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(newPassword, salt);
  db.admin.salt = salt;
  db.admin.passwordHash = passwordHash;
  saveDatabase(db);
}

export function getStats(): AdminStats {
  const db = initDatabase();
  const total = db.registrations.length;
  const confirmed = db.registrations.filter(r => r.status === 'confirmada').length;
  const pending = db.registrations.filter(r => r.status === 'pendente').length;
  const cancelled = db.registrations.filter(r => r.status === 'cancelada').length;

  return {
    totalRegistrations: total,
    confirmedRegistrations: confirmed,
    pendingRegistrations: pending,
    cancelledRegistrations: cancelled,
    totalGallery: db.gallery.length,
    totalVideos: db.videos.length,
    totalTestimonials: db.testimonials.length,
  };
}
