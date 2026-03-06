import type { Article, Category, Author, ArticleTranslation, CategoryTranslation } from '@/types';
import type { ArticleWithTranslations } from '@/hooks/useArticles';
import type { CategoryWithTranslations } from '@/hooks/useCategories';

export function mapSupabaseArticle(raw: ArticleWithTranslations): Article {
  const category = raw.categories ? mapSupabaseCategory({
    ...raw.categories,
    category_translations: [],
  }) : undefined;

  const author: Author | undefined = raw.profiles ? {
    id: raw.profiles.id,
    email: '',
    name: raw.profiles.display_name || 'Unknown',
    avatar: raw.profiles.avatar_url || undefined,
    bio: raw.profiles.bio || undefined,
    role: 'editor',
  } : undefined;

  const translations: ArticleTranslation[] = (raw.article_translations || []).map(t => ({
    id: t.id,
    articleId: t.article_id,
    locale: t.locale as 'en' | 'ar',
    title: t.title,
    excerpt: t.excerpt || undefined,
    content: t.content,
    metaTitle: t.meta_title || undefined,
    metaDescription: t.meta_description || undefined,
    readingTime: t.reading_time || undefined,
  }));

  return {
    id: raw.id,
    slug: raw.slug,
    featuredImage: raw.featured_image || undefined,
    categoryId: raw.category_id || undefined,
    category,
    authorId: raw.author_id,
    author,
    status: raw.status as Article['status'],
    publishedAt: raw.published_at || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    translations,
  };
}

export function mapSupabaseCategory(raw: CategoryWithTranslations): Category {
  const translations: CategoryTranslation[] = (raw.category_translations || []).map(t => ({
    id: t.id,
    categoryId: t.category_id,
    locale: t.locale as 'en' | 'ar',
    name: t.name,
    description: t.description || undefined,
  }));

  return {
    id: raw.id,
    slug: raw.slug,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    translations,
  };
}

export function getArticleTranslation(article: Article, locale: 'en' | 'ar') {
  return article.translations.find(t => t.locale === locale) || article.translations[0];
}

export function getCategoryTranslation(category: Category, locale: 'en' | 'ar') {
  return category.translations.find(t => t.locale === locale) || category.translations[0];
}
