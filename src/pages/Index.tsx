import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { CategoryCard } from '@/components/articles/CategoryCard';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { usePublishedArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { mapSupabaseArticle, mapSupabaseCategory } from '@/lib/mappers';

const Index = () => {
  const { t, locale } = useLocale();
  const { data: rawArticles = [] } = usePublishedArticles();
  const { data: rawCategories = [] } = useCategories();

  const articles = rawArticles.map(mapSupabaseArticle);
  const categories = rawCategories.map(mapSupabaseCategory);

  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1, 5);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[80vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl"
        />

        <div className="container-editorial relative z-10 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                {locale === 'ar' ? 'اكتشف قصصاً ملهمة' : 'Discover Inspiring Stories'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
              <span className="block">{t('home.hero.title').split(' ')[0]}</span>
              <span className="block gradient-text">{t('home.hero.title').split(' ').slice(1).join(' ')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              {t('home.hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="group">
                <Link to="/articles">
                  {t('home.hero.cta')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/categories">{t('categories.title')}</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="container-editorial py-16 md:py-24">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-editorial rounded-full" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold">{t('home.featured')}</h2>
            </div>
          </div>
          <ArticleCard article={featuredArticle} variant="featured" />
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="container-editorial py-16 md:py-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-editorial rounded-full" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold">{t('home.latest')}</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link to="/articles">
              {t('home.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container-editorial">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-editorial rounded-full" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold">{t('categories.title')}</h2>
            </div>
            <Button variant="ghost" asChild className="group">
              <Link to="/categories">
                {t('home.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

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
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container-editorial py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-editorial p-8 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {locale === 'ar' ? 'ابقَ على اطلاع' : 'Stay in the Loop'}
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              {locale === 'ar' 
                ? 'اشترك في نشرتنا الإخبارية واحصل على أحدث المقالات مباشرة في بريدك الإلكتروني.'
                : 'Subscribe to our newsletter and get the latest articles delivered straight to your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Enter your email'}
                className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
              />
              <Button variant="secondary" size="lg">
                {locale === 'ar' ? 'اشترك' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </PublicLayout>
  );
};

export default Index;
