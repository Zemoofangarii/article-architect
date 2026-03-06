import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ArticleEditor } from '@/components/dashboard/ArticleEditor';
import { useAllArticles } from '@/hooks/useArticles';
import { useLocale } from '@/contexts/LocaleContext';

const ArticleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: articles = [], isLoading } = useAllArticles();
  const { t } = useLocale();

  const article = articles.find(a => a.id === id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">{t('common.notFound')}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ArticleEditor article={article} />
    </DashboardLayout>
  );
};

export default ArticleEdit;
