import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useLocale } from '@/contexts/LocaleContext';

const DashboardMedia = () => {
  const { t } = useLocale();

  return (
    <DashboardLayout>
      <h1 className="font-serif text-2xl font-bold mb-6">{t('dashboard.media')}</h1>
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground">Media library coming soon. Upload images via the article editor.</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardMedia;
