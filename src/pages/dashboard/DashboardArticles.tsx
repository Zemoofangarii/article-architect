import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllArticles, useDeleteArticle } from '@/hooks/useArticles';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DashboardArticles = () => {
  const { data: articles = [], isLoading } = useAllArticles();
  const deleteArticle = useDeleteArticle();
  const { t, locale } = useLocale();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast.success('Article deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">{t('dashboard.articles')}</h1>
        <Button asChild>
          <Link to="/dashboard/articles/new">
            <Plus className="h-4 w-4 mr-2" />
            {t('dashboard.newArticle')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="p-6 text-muted-foreground">{t('common.loading')}</p>
          ) : articles.length === 0 ? (
            <p className="p-6 text-muted-foreground">{t('articles.empty')}</p>
          ) : (
            <div className="divide-y divide-border">
              {articles.map((article) => {
                const translation = article.article_translations?.find(t => t.locale === locale) || article.article_translations?.[0];
                return (
                  <div key={article.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{translation?.title || article.slug}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          article.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {article.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/articles/${article.id}/edit`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {userRole === 'admin' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(article.id)}>{t('common.delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
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

export default DashboardArticles;
