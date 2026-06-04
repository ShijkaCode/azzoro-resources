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
  font_body?: string;
  font_display?: string;
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

// Why Mongolia / Why Azzuro sections. One flexible shape covers both the
// image-gallery layout (IntroSection: per-card images) and the tiles layout
// (WhatWeDo: banner image + per-card tags).
export type HomeFeatureSection = {
  eyebrow: string;
  headline: string;
  image?: string;
  image_alt?: string;
  intro: string;
  footnote?: string;
  cards: { title: string; body: string; image?: string; image_alt?: string; tag?: string }[];
};

export type HomeContent = {
  hero: { video_id: string; kicker?: string; headline: string; subline?: string; cta_label: string; cta_href: string; asx_url?: string; announcements_url?: string; presentation_url?: string };
  metrics: { value: string; label: string; source?: string }[];
  // Both sections share one shape so either layout component (IntroSection /
  // WhatWeDo) can render either section — the client swaps presentation in code
  // and fills the matching fields in the CMS.
  why_mongolia: HomeFeatureSection;
  why_azzuro: HomeFeatureSection;
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

export type EsgMetric = { value: string; label: string; detail?: string };

export type EsgContent = {
  hero_image?: string;
  hero_headline?: string;
  hero_subline?: string;
  approach_body: string;
  // Attention-grabbing stat strip (animated count-up). Concrete, sourced figures.
  metrics?: EsgMetric[];
  // "Our approach" — the three field principles (trust, FPIC, herder relations).
  principles?: { title: string; body: string }[];
  // Credibility anchors: Responsible Mining Codex, FPIC documentation, resource mapping.
  commitments?: { title: string; body: string }[];
  // "How we engage" — the structured step-by-step engagement process.
  engagement_steps?: { title: string; body: string }[];
  // Environmental stewardship: lead body + image + themed data topics (water, biodiversity, …).
  environment: { body: string; image?: string; topics?: { topic: string; body: string }[] };
  // Stakeholder engagement: Social Responsibility Agreement deliverables, grouped by soum.
  community: { body: string; image?: string };
  sra_locations?: { location: string; region?: string; items: string[] }[];
  // Local investment, grouped by theme (education, livelihoods, health, environment).
  investment?: { body: string; categories: { category: string; title: string; body: string; image?: string }[] };
  // Community stories from the field — first-person, with named author + role.
  stories_intro?: string;
  stories?: { title: string; body: string; author: string; role: string; image?: string }[];
  reports_intro: string;
  gallery?: { image: string; caption?: string }[];
};

export type GalleryContent = {
  intro_heading: string;
  intro_body: string;
  // Field photos grouped by tag. Each group is a filter chip; images are a
  // bulk drag-drop array. (Images come from EN via locale fallback.)
  photo_groups?: { tag: string; images?: string[] }[];
};

export type ProjectsPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
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

export type InvestorRegistryPhoneNumber = { label?: string; number: string };
export type InvestorRegistryPhoneBlock = { label?: string; numbers: InvestorRegistryPhoneNumber[] };
export type InvestorRegistry = {
  name: string;
  section_label?: string;
  address?: string;
  email?: string;
  website_url?: string;
  website_label?: string;
  phones?: InvestorRegistryPhoneBlock[];
};
export type InvestorContact = {
  name: string;
  role: string;
  phone?: string;
  email?: string;
};

export type InvestorCommunicationContent = {
  eyebrow: string;
  headline: string;
  intro?: string;
  listing_heading: string;
  listing_statements: string[];
  registries_heading: string;
  registries_intro: string;
  registries: InvestorRegistry[];
  receiving_heading: string;
  receiving_body: string;
  rights_heading: string;
  rights_body: string;
  contacts_heading: string;
  contacts: InvestorContact[];
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

// Flexible body: the client adds/reorders text and image sections in the CMS
// instead of a single long body. Discriminated by `type` (Sveltia list types).
export type ProjectContentBlock =
  | { type: 'text'; body: string }
  | { type: 'image'; image: string; caption?: string }
  // Two-column row: text + image side by side. `reverse` puts the image on the left.
  | { type: 'split'; body?: string; image?: string; caption?: string; reverse?: boolean };

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
  // Legacy single body (markdown content area) — kept as a fallback for any
  // entry not yet migrated to content_blocks.
  body?: string;
  content_blocks?: ProjectContentBlock[];
  // "From the field" photo gallery (separate from the technical gallery_images
  // figures), shown on the project page only when show_gallery is on.
  show_gallery?: boolean;
  gallery_heading?: string;
  gallery?: { image: string; caption?: string }[];
  data_cards?: { label: string; value: string }[];
  documents?: { label: string; file: string }[];
  // Optional structured fields (added for the full project profiles).
  tagline?: string;
  is_flagship?: boolean;
  is_draft?: boolean;
  group_as_other?: boolean;
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
  tags?: string[];
  date?: string;
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
  draft?: boolean;
};

export type Partner = {
  slug: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
};