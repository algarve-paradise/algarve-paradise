export type NavItem = {
  label: string;
  href: string;
  description?: string;
  cta?: boolean;
};

export type Stat = {
  value: string;
  label: string;
};

export type CtaLink = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
};

export type HeroBlock = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  stats: Stat[];
  highlight?: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  bullets: string[];
  tag: string;
};

export type NewsCategory =
  | "Algarve"
  | "Municipios"
  | "Economia"
  | "Turismo"
  | "Seguranca"
  | "Eventos";

export type NewsStatus = "draft" | "published";

export type NewsItem = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: NewsCategory;
  href: string;
  imageLabel: string;
  imageUrl?: string | null;
  content?: string;
  authorName?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  status?: NewsStatus;
  featured?: boolean;
  live?: boolean;
  region?: string;
  aiGenerated?: boolean;
  aiProvider?: string | null;
  aiModel?: string | null;
  aiConfidence?: number | null;
  aiReviewDeadline?: string | null;
};

export type EventItem = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  startsAt?: string;
  endsAt?: string | null;
  location: string;
  description: string;
  href: string;
  imageLabel: string;
  imageUrl?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  status?: NewsStatus;
  region?: string;
  aiGenerated?: boolean;
  aiProvider?: string | null;
  aiModel?: string | null;
  aiConfidence?: number | null;
  aiReviewDeadline?: string | null;
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

export type FounderItem = {
  name: string;
  role: string;
  description: string;
  imageLabel: string;
};

export type CommunityMessage = {
  name: string;
  municipality: string;
  message: string;
};

export type ContactFormField = {
  label: string;
  name: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type CronicaStatus = "draft" | "published";

export type CronicaItem = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole?: string | null;
  authorAvatarUrl?: string | null;
  weekLabel: string;
  status: CronicaStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};
