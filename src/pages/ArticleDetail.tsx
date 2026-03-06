import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Share2, Copy, Twitter, Linkedin, Facebook, Check } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/contexts/LocaleContext';
import { useArticleBySlug, usePublishedArticles } from '@/hooks/useArticles';
import { mapSupabaseArticle, getArticleTranslation, getCategoryTranslation } from '@/lib/mappers';
import { formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useLocale();
  const [copied, setCopied] = React.useState(false);
  const { data: rawArticle, isLoading } = useArticleBySlug(slug);
  const { data: rawAllArticles = [] } = usePublishedArticles();

  const article = rawArticle ? mapSupabaseArticle(rawArticle) : null;
  const allArticles = rawAllArticles.map(mapSupabaseArticle);
  
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container-editorial py-32 text-center">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </PublicLayout>
    );
  }

  if (!article) {
    return (
      <PublicLayout>
        <div className="container-editorial py-32 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">{t('common.notFound')}</h1>
          <Button asChild>
            <Link to="/articles">{t('nav.articles')}</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const translation = getArticleTranslation(article, locale);
  const categoryTranslation = article.category
    ? getCategoryTranslation(article.category, locale)
    : null;

  const relatedArticles = allArticles
    .filter(a => a.id !== article.id && a.categoryId === article.categoryId)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success(t('article.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(translation.title);

  return (
    <PublicLayout>
      {/* Hero */}
      <article>
        <header className="relative">
          {/* Featured Image */}
          <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
            <img
              src={article.featuredImage}
              alt={translation.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="container-editorial relative -mt-48 md:-mt-64 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Back Link */}
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('nav.articles')}
              </Link>

              {/* Category */}
              {categoryTranslation && (
                <Badge variant="secondary" className="mb-4 bg-primary text-primary-foreground">
                  {categoryTranslation.name}
                </Badge>
              )}

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {translation.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8">
                {article.author && (
                  <div className="flex items-center gap-3">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{article.author.name}</p>
                      <p className="text-xs">{article.author.bio}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.publishedAt || article.createdAt, locale)}
                  </span>
                  {translation.readingTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {translation.readingTime} {t('articles.readingTime')}
                    </span>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('article.share')}:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      {t('article.share')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {t('article.copyLink')}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="container-editorial py-12 md:py-16"
        >
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            {translation.excerpt && (
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 font-serif italic">
                {translation.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose-editorial"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />
          </div>
        </motion.div>

        {/* Author Card */}
        {article.author && (
          <div className="container-editorial pb-12 md:pb-16">
            <div className="max-w-3xl mx-auto">
              <div className="p-6 md:p-8 rounded-2xl bg-card border border-border">
                <div className="flex items-start gap-4 md:gap-6">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {locale === 'ar' ? 'كُتب بواسطة' : 'Written by'}
                    </p>
                    <h3 className="font-serif text-xl font-semibold mb-2">{article.author.name}</h3>
                    <p className="text-muted-foreground">{article.author.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container-editorial">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-editorial rounded-full" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold">
                {t('article.relatedArticles')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedArticles.map((relatedArticle, index) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
};

export default ArticleDetail;
