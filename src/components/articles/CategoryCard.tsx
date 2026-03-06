import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { getCategoryTranslation } from '@/lib/mappers';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  articleCount?: number;
  index?: number;
}

export function CategoryCard({ category, articleCount = 0, index = 0 }: CategoryCardProps) {
  const { locale } = useLocale();
  const translation = getCategoryTranslation(category, locale);

  const gradients = [
    'from-orange-500 to-amber-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link
        to={`/categories/${category.slug}`}
        className={cn(
          'block p-6 rounded-2xl bg-gradient-to-br transition-all duration-300',
          'hover:shadow-lg hover:-translate-y-1',
          gradient
        )}
      >
        <h3 className="font-serif text-xl md:text-2xl font-bold text-primary-foreground mb-2">
          {translation.name}
        </h3>
        {translation.description && (
          <p className="text-primary-foreground/80 text-sm line-clamp-2 mb-3">
            {translation.description}
          </p>
        )}
        <span className="text-sm text-primary-foreground/70">
          {locale === 'ar' 
            ? `${articleCount} مقالة` 
            : `${articleCount} articles`}
        </span>
      </Link>
    </motion.article>
  );
}
