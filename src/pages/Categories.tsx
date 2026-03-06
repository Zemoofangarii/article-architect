import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { CategoryCard } from '@/components/articles/CategoryCard';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { usePublishedArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { mapSupabaseArticle, mapSupabaseCategory, getCategoryTranslation } from '@/lib/mappers';

const Categories = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { t, locale } = useLocale();
  const { data: rawCategories = [] } = useCategories();
  const { data: rawArticles = [] } = usePublishedArticles();

  const categories = rawCategories.map(mapSupabaseCategory);
  const articles = rawArticles.map(mapSupabaseArticle);

  // If slug is provided, show category detail
  if (slug) {
    const category = categories.find(c => c.slug === slug);

    if (!category) {
      return (
        <PublicLayout>
          <div className="container-editorial py-32 text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">{t('common.notFound')}</h1>
            <Button asChild>
              <Link to="/categories">{t('categories.title')}</Link>
            </Button>
          </div>
        </PublicLayout>
      );
    }

    const translation = getCategoryTranslation(category, locale);
    const categoryArticles = articles.filter(a => a.categoryId === category.id);

    return (
      <PublicLayout>
        {/* Header */}
        <section className="bg-gradient-hero pt-12 pb-16 md:pt-16 md:pb-24">
          <div className="container-editorial">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('categories.title')}
              </Link>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {translation.name}
              </h1>
              {translation.description && (
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {translation.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                {locale === 'ar' 
                  ? `${categoryArticles.length} مقالة` 
                  : `${categoryArticles.length} articles`}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Articles */}
        <section className="container-editorial py-12 md:py-16">
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categoryArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t('articles.empty')}</p>
            </div>
          )}
        </section>
      </PublicLayout>
    );
  }

  // Categories listing
  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-gradient-hero pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t('categories.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {locale === 'ar'
                ? 'تصفح مقالاتنا حسب الموضوع'
                : 'Browse our articles by topic'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container-editorial py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              articleCount={articles.filter(a => a.categoryId === category.id).length}
              index={index}
            />
          ))}
        </div>
      </section>
    </PublicLayout>
  );
};

export default Categories;
