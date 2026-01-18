// app/admin/dashboard/page.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import StructuredData from '@/lib/StructuredData';
import Loading from '../loading';

const DashboardClient = dynamic(
  () => import('@/components/admin-dashboard/DashboardClient'),
  {
    ssr: true,
    loading: () => <Loading/>
  }
);

export default function DashboardRoute() {
  return (
    <>
      <StructuredData />
      <DashboardClient />
    </>
  );
}
