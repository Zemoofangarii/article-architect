import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useLocale } from '@/contexts/LocaleContext';

const DashboardUsers = () => {
  const { t } = useLocale();

  return (
    <DashboardLayout>
      <h1 className="font-serif text-2xl font-bold mb-6">{t('dashboard.users')}</h1>
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground">User management coming soon.</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardUsers;
