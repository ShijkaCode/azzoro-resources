import type { Locale } from '@/lib/i18n/config';

export type SiteSettings = {
  brand_name: string;
  logo: string;
  logo_dark: string;
  stock_ticker: string;
  stock_api_enabled: boolean;
  investor_portal_url: string;
  social: { linkedin?: string; x?: string };
  default_locale: Locale;
};

export type NavItem = { label: string; href: string; external?: boolean };

export type NavSettings = {
  items: NavItem[];
};

export type FooterSettings = {
  tagline: string;
  link_columns: { heading: string; links: NavItem[] }[];
  copyright_holder: string;
  legal_links: NavItem[];
};

export type HomeContent = {
  hero: { video_id: string; headline: string; subline: string; cta_label: string; cta_href: string };
  metrics: { value: string; label: string; source?: string }[];
  why_mongolia_intro: string;
  why_mongolia_cards: { icon?: string; title: string; body: string }[];
  why_azzoro_intro: string;
  why_azzoro_cards: { icon?: string; title: string; body: string }[];
  sustainability_teaser: { heading: string; body: string; image?: string; cta_label: string; cta_href: string };
  leadership_teaser: { heading: string; body: string; cta_label: string; cta_href: string };
  news_section_enabled: boolean;
  stock_section_enabled: boolean;
};

export type AboutContent = {
  hero_image?: string;
  story_body: string;
  mission: string;
  values: { icon?: string; title: string; body: string }[];
  leadership_governance_body: string;
  governance_documents_intro: string;
};

export type EsgContent = {
  hero_image?: string;
  approach_body: string;
  environment: { body: string; image?: string };
  community: { body: string; image?: string };
  reports_intro: string;
};

export type GalleryContent = {
  intro_heading: string;
  intro_body: string;
  filter_tags: { slug: string; label: string }[];
};

export type ContactOffice = {
  name: string;
  address: string;
  email?: string;
  hours?: string;
  lat?: number;
  lng?: number;
};

export type ContactContent = {
  intro_body: string;
  offices: ContactOffice[];
  phone_groups: { category: string; numbers: { label: string; number: string }[] }[];
  general_email: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  team_section: 'Board' | 'Technical';
  photo?: string;
  bio: string;
  order: number;
};

export type GovernanceDocument = {
  slug: string;
  title: string;
  category: 'Constitution' | 'Charters' | 'Policies' | 'Reports' | 'Disclosures';
  file: string;
  effective_date: string;
  description?: string;
};

export type Project = {
  slug: string;
  title: string;
  commodity: string[];
  status: 'Active exploration' | 'Drilling' | 'Resource definition' | 'Paused';
  region: string;
  lat: number;
  lng: number;
  license_area_km2?: number;
  acquired_date?: string;
  hero_image: string;
  gallery_images?: string[];
  summary: string;
  body: string;
  data_cards?: { label: string; value: string }[];
  documents?: { label: string; file: string }[];
};

export type GalleryPhoto = {
  slug: string;
  image: string;
  caption?: string;
  tags: string[];
  date: string;
  featured?: boolean;
};

export type GalleryVideo = {
  slug: string;
  title: string;
  description?: string;
  stream_uid: string;
  thumbnail?: string;
  tags: string[];
  date: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  hero_image: string;
  body: string;
  pull_quote?: string;
  related?: string[];
  date: string;
};

export type Partner = {
  slug: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
};