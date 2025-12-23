import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/contexts/LocaleContext';
import { mockArticles, mockCategories, getCategoryTranslation } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const Articles = () => {
  const { t, locale } = useLocale();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? mockArticles.filter(a => a.categoryId === selectedCategory)
    : mockArticles;

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
              {t('articles.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {locale === 'ar'
                ? 'استكشف جميع مقالاتنا في التكنولوجيا والتصميم والثقافة والأعمال.'
                : 'Explore all our articles across technology, design, culture, and business.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container-editorial py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.filter')}:</span>
            </div>
            
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="flex-shrink-0"
            >
              {t('categories.all')}
            </Button>

            {mockCategories.map((category) => {
              const translation = getCategoryTranslation(category, locale);
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-shrink-0"
                >
                  {translation.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container-editorial py-12 md:py-16">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{t('articles.empty')}</p>
          </div>
        )}

        {/* Load More */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              {locale === 'ar' ? 'تحميل المزيد' : 'Load More'}
            </Button>
          </div>
        )}
      </section>
    </PublicLayout>
  );
};

export default Articles;
