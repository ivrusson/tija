/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';

import EventForm from '@/components/events/EventForm';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { tijaService } from '@/core';
import { NextPageWithLayout } from '@/pages/_app';

interface Props {
  eventId: string;
  event: any;
}

const Event: NextPageWithLayout = ({ event }: Props) => {
  return (
    <div className='page page-event min-h-full'>
      <Seo templateTitle='Event page' />
      <EventForm event={event} />
    </div>
  );
};

Event.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { eventId } = context.query;
  const eventService = tijaService('events');
  const event = await eventService.getEvent(eventId);
  console.log({ event });

  return {
    props: { eventId, event },
  };
};

export default Event;
