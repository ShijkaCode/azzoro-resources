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
  investor_links?: { label: string; href: string }[];
};

export type FooterSettings = {
  tagline: string;
  link_columns: { heading: string; links: NavItem[] }[];
  copyright_holder: string;
  legal_links: NavItem[];
};

// Home page "featured project" highlight (the Oval / Red Hill style sections).
// Fully CMS-managed so the client can change name, copy, stats, link and photos.
export type FeaturedProject = {
  eyebrow?: string;
  headline: string;
  lead: string;
  image: string;
  image_alt?: string;
  stats: { value: string; label: string }[];
  thumbnails: { image: string; caption?: string; alt?: string }[];
  cta_label: string;
  cta_href: string;
  footnote?: string;
};

export type HomeContent = {
  hero: { video_id: string; kicker?: string; headline: string; subline?: string; cta_label: string; cta_href: string; asx_url?: string; announcements_url?: string; presentation_url?: string };
  metrics: { value: string; label: string; source?: string }[];
  why_mongolia: {
    eyebrow: string;
    headline: string;
    intro: string;
    footnote?: string;
    cards: { title: string; body: string; image?: string; image_alt?: string }[];
  };
  why_azzoro: {
    eyebrow: string;
    headline: string;
    image?: string;
    image_alt?: string;
    intro: string;
    footnote?: string;
    cards: { title: string; body: string; tag?: string }[];
  };
  sustainability_teaser: { heading: string; body: string; image?: string; cta_label: string; cta_href: string };
  home_sustainability?: {
    eyebrow: string;
    cards: { tag: string; title: string; body: string; image?: string; image_alt?: string }[];
  };
  leadership_teaser: { heading: string; body: string; cta_label: string; cta_href: string };
  featured_projects?: FeaturedProject[];
  // Investor snapshot text + manually-maintained figures. Share price, change and
  // market cap are fetched from the ASX feed (not stored here).
  investor_snapshot?: {
    eyebrow: string;
    headline: string;
    kpis: { value: string; label: string }[];
    footnote: string;
  };
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
  hero_headline?: string;
  approach_body: string;
  environment: { body: string; image?: string };
  community: { body: string; image?: string };
  governance?: { body: string; image?: string };
  reports_intro: string;
  gallery?: { image: string; caption?: string }[];
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
  image?: string;
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
  // Short one-line summary shown on the home "Leadership & governance" grid (Board members).
  home_credential?: string;
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
  order?: number;
  commodity: string[];
  status: 'Active exploration' | 'Drilling' | 'Resource definition' | 'Paused';
  region: string;
  lat: number;
  lng: number;
  license_area_km2?: number;
  acquired_date?: string;
  hero_image: string;
  gallery_images?: { image: string; caption?: string }[];
  summary: string;
  body: string;
  data_cards?: { label: string; value: string }[];
  documents?: { label: string; file: string }[];
  // Optional structured fields (added for the full project profiles).
  tagline?: string;
  is_flagship?: boolean;
  is_draft?: boolean;
  parent_project?: string;
  tenure?: {
    licence?: string;
    licence_type?: string;
    area_km2?: number;
    ownership?: string;
    province?: string;
  };
  drill_highlights?: { hole: string; intercept: string }[];
  resource_table?: {
    note?: string;
    rows: { category: string; tonnes: string; grade: string; contained: string }[];
  };
  exploration_target?: { label: string; statement: string; cautionary: string };
  historical_estimate?: { label: string; statement: string; cautionary: string };
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