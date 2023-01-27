/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement } from 'react';

import EventForm from '@/components/events/EventForm';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { tijaService } from '@/core';
import { csrf } from '@/core/csrf';
import { withTijaSsr } from '@/core/routers';
import { NextPageWithLayout } from '@/pages/_app';

interface Props {
  csrfToken: string;
  eventId: string;
  event: any;
}

const Event: NextPageWithLayout<Props> = ({ csrfToken, event }) => {
  return (
    <div className='page page-event min-h-full'>
      <Seo templateTitle='Event page' />
      <EventForm event={event} csrfToken={csrfToken} />
      {/* <div className='mt-2'>
        <pre className='flex-wrap bg-gray-900 text-white'>
          {JSON.stringify(event, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

Event.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = withTijaSsr(async (context) => {
  const { req, res, query } = context;
  await csrf(req, res);

  const { eventId } = query;
  const eventService = tijaService('events');
  const event = await eventService.getEvent(eventId);
  const token = req.csrfToken();
  return {
    props: {
      csrfToken: token as string,
      eventId,
      event,
    },
  };
});

export default Event;
