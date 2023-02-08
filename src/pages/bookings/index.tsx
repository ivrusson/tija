/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from 'next';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { NextPageWithLayout } from '@/pages/_app';

const Events: NextPageWithLayout = () => {
  return (
    <Layout>
      <div className='page page-bookings'>
        <Seo templateTitle='Bookings page' />
        <div className='py-8'>
          <div className='mb-8 text-center'>
            <h1 className='text-white'>Bookings</h1>
          </div>
        </div>
        {/* <pre className='bg-gray-800 text-white'>{JSON.stringify(events[0], null, 2)}</pre> */}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
    props: {},
  };
};

export default Events;
