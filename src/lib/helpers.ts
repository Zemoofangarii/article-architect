import { cn } from '@/lib/utils';

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function formatDate(dateString: string, locale: 'en' | 'ar' = 'en'): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateMetaDescription(content: string, maxLength: number = 160): string {
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return truncateText(text, maxLength);
}

export { cn };
