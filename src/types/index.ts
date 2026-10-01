export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBgMain: string;
  colorBgSecondary: string;
  colorTextTitle: string;
  colorTextMain: string;
  colorTextSecondary: string;
  colorButtonBg: string;
  colorButtonText: string;
  colorLink: string;
  colorBorder: string;
  colorCardBg: string;
  colorCardBorder: string;
  colorFormFocus: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
}

export interface EventInfo {
  title: string;
  subtitle: string;
  themeVerse: string;
  themeVerseReference: string;
  month: string;
  duration: string;
  datesText: string;
  isDateConfirmed: boolean;
  locationName: string;
  locationAddress: string;
  isLocationConfirmed: boolean;
  investmentText: string;
  paymentMethods: string;
  isInvestmentConfirmed: boolean;
  lodgingInfo: string;
  mealsInfo: string;
  scheduleHighlights: { time: string; activity: string; day: string }[];
  importantNotice: string;
  officialFlyerUrl?: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Registration {
  id: string;
  protocol: string;

  fullName: string;
  birthDate: string;
  phone: string;
  address: string;
  rg: string;
  cpf: string;
  slipperSize: string;
  shirtSize: string;
  acknowledgement: boolean;

  status: 'pendente' | 'confirmada' | 'cancelada';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  isFeatured?: boolean;
  order: number;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  duration?: string;
  isActive: boolean;
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  edition: string;
  quote: string;
  avatarUrl?: string;
  isActive: boolean;
  order: number;
}

export interface PublicData {
  theme: ThemeConfig;
  eventInfo: EventInfo;
  gallery: GalleryItem[];
  videos: VideoItem[];
  testimonials: TestimonialItem[];
}

export interface AdminStats {
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  cancelledRegistrations: number;
  totalGallery: number;
  totalVideos: number;
  totalTestimonials: number;
}
