import React from 'react';
import { FileText, FolderOpen, Eye, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useLocale } from '@/contexts/LocaleContext';

const DashboardOverview = () => {
  const { data: articles = [] } = useAllArticles();
  const { data: categories = [] } = useCategories();
  const { t } = useLocale();

  const published = articles.filter(a => a.status === 'published').length;
  const drafts = articles.filter(a => a.status === 'draft').length;

  const stats = [
    { label: t('dashboard.articles'), value: articles.length, icon: FileText, color: 'text-primary' },
    { label: t('dashboard.published'), value: published, icon: Eye, color: 'text-emerald-500' },
    { label: t('dashboard.drafts'), value: drafts, icon: FileText, color: 'text-amber-500' },
    { label: t('dashboard.categories'), value: categories.length, icon: FolderOpen, color: 'text-accent' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">{t('dashboard.overview')}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={cn('h-4 w-4', stat.color)} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <p className="text-muted-foreground text-sm">No articles yet. Create your first article!</p>
          ) : (
            <div className="space-y-3">
              {articles.slice(0, 5).map((article) => {
                const enTranslation = article.article_translations?.find(t => t.locale === 'en');
                return (
                  <div key={article.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{enTranslation?.title || article.slug}</p>
                      <p className="text-xs text-muted-foreground">{new Date(article.updated_at).toLocaleDateString()}</p>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      article.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    )}>
                      {article.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default DashboardOverview;
