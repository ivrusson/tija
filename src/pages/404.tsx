import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle='Not Found' />
      <div className='py-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-white'>Page not found</h1>
        </div>
      </div>
    </Layout>
  );
}
