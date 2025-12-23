import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Article } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { getArticleTranslation, getCategoryTranslation } from '@/lib/mockData';
import { formatDate, cn } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
}

export function ArticleCard({ article, variant = 'default', index = 0 }: ArticleCardProps) {
  const { locale, t } = useLocale();
  const translation = getArticleTranslation(article, locale);
  const categoryTranslation = article.category 
    ? getCategoryTranslation(article.category, locale) 
    : null;

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-2xl bg-card shadow-lg card-hover"
      >
        <Link to={`/articles/${article.slug}`} className="block">
          <div className="aspect-[16/10] md:aspect-[21/9] overflow-hidden">
            <img
              src={article.featuredImage}
              alt={translation.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-overlay/90 via-overlay/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            {categoryTranslation && (
              <Badge variant="secondary" className="mb-4 bg-primary/90 text-primary-foreground border-0">
                {categoryTranslation.name}
              </Badge>
            )}
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {translation.title}
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-base line-clamp-2 max-w-2xl mb-4">
              {translation.excerpt}
            </p>
            <div className="flex items-center gap-4 text-primary-foreground/70 text-sm">
              {article.author && (
                <div className="flex items-center gap-2">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{article.author.name}</span>
                </div>
              )}
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{formatDate(article.publishedAt || article.createdAt, locale)}</span>
              {translation.readingTime && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {translation.readingTime} {t('articles.readingTime')}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group"
      >
        <Link to={`/articles/${article.slug}`} className="flex gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={article.featuredImage}
              alt={translation.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            {categoryTranslation && (
              <span className="text-xs font-medium text-primary">
                {categoryTranslation.name}
              </span>
            )}
            <h3 className="font-serif text-sm md:text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors mt-1">
              {translation.title}
            </h3>
            <span className="text-xs text-muted-foreground mt-1 block">
              {formatDate(article.publishedAt || article.createdAt, locale)}
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-xl overflow-hidden shadow-sm card-hover border border-border/50"
    >
      <Link to={`/articles/${article.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.featuredImage}
            alt={translation.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            {categoryTranslation && (
              <Badge variant="outline" className="text-xs">
                {categoryTranslation.name}
              </Badge>
            )}
            {translation.readingTime && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {translation.readingTime} {t('articles.readingTime')}
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg md:text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {translation.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {translation.excerpt}
          </p>
          <div className="flex items-center justify-between">
            {article.author && (
              <div className="flex items-center gap-2">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm text-muted-foreground">{article.author.name}</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt || article.createdAt, locale)}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
