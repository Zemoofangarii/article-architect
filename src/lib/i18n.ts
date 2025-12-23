import { Locale, Direction } from '@/types';

export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';

export const localeConfig: Record<Locale, { 
  name: string; 
  nativeName: string; 
  direction: Direction;
  flag: string;
}> = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
  },
};

// Translation dictionaries
export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.articles': 'Articles',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.logout': 'Logout',

    // Home
    'home.hero.title': 'Stories That Matter',
    'home.hero.subtitle': 'Discover thought-provoking articles and insights from leading voices across technology, culture, and beyond.',
    'home.hero.cta': 'Start Reading',
    'home.featured': 'Featured',
    'home.latest': 'Latest Articles',
    'home.viewAll': 'View All',

    // Articles
    'articles.title': 'All Articles',
    'articles.empty': 'No articles found',
    'articles.readMore': 'Read More',
    'articles.readingTime': 'min read',
    'articles.publishedOn': 'Published on',

    // Categories
    'categories.title': 'Categories',
    'categories.all': 'All',

    // Article
    'article.share': 'Share',
    'article.copyLink': 'Copy Link',
    'article.copied': 'Copied!',
    'article.relatedArticles': 'Related Articles',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.articles': 'Articles',
    'dashboard.categories': 'Categories',
    'dashboard.media': 'Media Library',
    'dashboard.users': 'Users',
    'dashboard.settings': 'Settings',
    'dashboard.newArticle': 'New Article',
    'dashboard.editArticle': 'Edit Article',
    'dashboard.drafts': 'Drafts',
    'dashboard.published': 'Published',

    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.notFound': 'Page not found',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.articles': 'المقالات',
    'nav.categories': 'التصنيفات',
    'nav.about': 'عن الموقع',
    'nav.contact': 'اتصل بنا',
    'nav.dashboard': 'لوحة التحكم',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',

    // Home
    'home.hero.title': 'قصص تستحق القراءة',
    'home.hero.subtitle': 'اكتشف مقالات ورؤى مثيرة للتفكير من أصوات رائدة في مجالات التكنولوجيا والثقافة وما بعدها.',
    'home.hero.cta': 'ابدأ القراءة',
    'home.featured': 'مميز',
    'home.latest': 'أحدث المقالات',
    'home.viewAll': 'عرض الكل',

    // Articles
    'articles.title': 'جميع المقالات',
    'articles.empty': 'لا توجد مقالات',
    'articles.readMore': 'اقرأ المزيد',
    'articles.readingTime': 'دقيقة للقراءة',
    'articles.publishedOn': 'نُشر في',

    // Categories
    'categories.title': 'التصنيفات',
    'categories.all': 'الكل',

    // Article
    'article.share': 'مشاركة',
    'article.copyLink': 'نسخ الرابط',
    'article.copied': 'تم النسخ!',
    'article.relatedArticles': 'مقالات ذات صلة',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.articles': 'المقالات',
    'dashboard.categories': 'التصنيفات',
    'dashboard.media': 'مكتبة الوسائط',
    'dashboard.users': 'المستخدمين',
    'dashboard.settings': 'الإعدادات',
    'dashboard.newArticle': 'مقالة جديدة',
    'dashboard.editArticle': 'تعديل المقالة',
    'dashboard.drafts': 'المسودات',
    'dashboard.published': 'المنشورة',

    // Common
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.create': 'إنشاء',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ ما',
    'common.notFound': 'الصفحة غير موجودة',

    // Footer
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
  },
};

export function getTranslation(locale: Locale, key: string): string {
  return translations[locale][key] || key;
}

export function getDirection(locale: Locale): Direction {
  return localeConfig[locale].direction;
}
