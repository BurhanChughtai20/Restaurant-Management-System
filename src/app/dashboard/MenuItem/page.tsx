'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Loading from '@/app/loading';

const MenuItemsPage = dynamic(
  () => import('@/components/admin-dashboard/MenuItemsPage'),
  { ssr: true, loading: () => <Loading /> }
);

const MenuItemsRoute: React.FC = () => {
  return <MenuItemsPage />;
};

export default MenuItemsRoute;
