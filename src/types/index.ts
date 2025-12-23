// Locale types
export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

// User roles
export type UserRole = 'admin' | 'editor' | 'user';

// Article status
export type ArticleStatus = 'draft' | 'published' | 'archived';

// Category interface
export interface Category {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  translations: CategoryTranslation[];
}

export interface CategoryTranslation {
  id: string;
  categoryId: string;
  locale: Locale;
  name: string;
  description?: string;
}

// Article interface
export interface Article {
  id: string;
  slug: string;
  featuredImage?: string;
  categoryId?: string;
  category?: Category;
  authorId: string;
  author?: Author;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  translations: ArticleTranslation[];
}

export interface ArticleTranslation {
  id: string;
  articleId: string;
  locale: Locale;
  title: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTime?: number;
}

// Author interface
export interface Author {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
}

// Media interface
export interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt?: Record<Locale, string>;
  createdAt: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// SEO
export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

// Pagination
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  error?: string;
}
