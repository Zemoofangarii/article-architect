import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategories, useCreateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { useLocale } from '@/contexts/LocaleContext';
import { slugify } from '@/lib/helpers';
import { toast } from 'sonner';

const DashboardCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { t } = useLocale();

  const [open, setOpen] = useState(false);
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');

  const handleCreate = async () => {
    if (!nameEn) { toast.error('English name required'); return; }
    try {
      await createCategory.mutateAsync({
        slug: slugify(nameEn),
        translations: [
          { locale: 'en', name: nameEn, description: descEn || undefined },
          ...(nameAr ? [{ locale: 'ar', name: nameAr, description: descAr || undefined }] : []),
        ],
      });
      toast.success('Category created');
      setOpen(false);
      setNameEn(''); setNameAr(''); setDescEn(''); setDescAr('');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Category deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">{t('dashboard.categories')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name (EN)</Label>
                  <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Name (AR)</Label>
                  <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description (EN)</Label>
                  <Input value={descEn} onChange={(e) => setDescEn(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description (AR)</Label>
                  <Input value={descAr} onChange={(e) => setDescAr(e.target.value)} dir="rtl" />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createCategory.isPending}>
                {createCategory.isPending ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground">{t('common.loading')}</p>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground">No categories yet.</p>
        ) : categories.map((cat) => {
          const en = cat.category_translations?.find(t => t.locale === 'en');
          const ar = cat.category_translations?.find(t => t.locale === 'ar');
          return (
            <Card key={cat.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">{en?.name || cat.slug}</CardTitle>
                  {ar && <p className="text-sm text-muted-foreground mt-1" dir="rtl">{ar.name}</p>}
                </div>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              {en?.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{en.description}</p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default DashboardCategories;
