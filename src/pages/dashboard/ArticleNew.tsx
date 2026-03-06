import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ArticleEditor } from '@/components/dashboard/ArticleEditor';

const ArticleNew = () => {
  return (
    <DashboardLayout>
      <ArticleEditor />
    </DashboardLayout>
  );
};

export default ArticleNew;
