import Loading from '@/app/loading';
import dynamic from 'next/dynamic';
import React from 'react';

const ChefsPage = dynamic(
  () => import('@/components/admin-dashboard/Chef'),
  { ssr: true, loading: () => <Loading/> },
);

const ChefsRoute = () => {
  return <ChefsPage />;
};

export default ChefsRoute;
