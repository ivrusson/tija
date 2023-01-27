/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';

import EventList from '@/components/events/EventList';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { tijaService } from '@/core';
import { NextPageWithLayout } from '@/pages/_app';

interface Props {
  events: any[];
}

const Home: NextPageWithLayout<Props> = ({ events }) => {
  return (
    <div className='page page-event'>
      <Seo templateTitle='Events page' />
      <div className='py-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-white'>Book an event</h1>
        </div>
        <EventList events={events} />
      </div>
      {/* <pre className='bg-gray-800 text-white'>{JSON.stringify(events[0], null, 2)}</pre> */}
    </div>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const eventService = tijaService('events');
  const events = await eventService.getEvents();

  return {
    props: { events: events.results },
  };
};

export default Home;
