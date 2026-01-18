'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Loading from '@/app/loading';

const OrderTakersPage = dynamic(
  () => import('@/components/admin-dashboard/OrderTakersPage'),
  { ssr: true, loading: () => <Loading /> }
);

const OrderTakersRoute: React.FC = () => {
  return <OrderTakersPage />;
};

export default OrderTakersRoute;
