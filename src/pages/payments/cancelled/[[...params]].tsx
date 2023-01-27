/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from 'next';

import Layout from '@/components/layout/Layout';
import CancelledCard from '@/components/payments/CancelledCard';
import Seo from '@/components/Seo';

import { tijaService } from '@/core';
import { NextPageWithLayout } from '@/pages/_app';

interface Props {
  booking: any;
  event: any;
}

const PaymentCancelled: NextPageWithLayout<Props> = (props) => {
  return (
    <Layout>
      <div className='page page-event'>
        <Seo templateTitle='Payment Cancelled' />
        <div className='py-8'>
          <div className='mb-8 text-center'>
            <h1 className='text-white'>Payment Cancelled</h1>
            <CancelledCard {...props} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params = [] } = context.query;
  if (!params[0]) {
    return {
      notFound: true,
    };
  }

  try {
    const bookingService = tijaService('bookings');
    const booking = await bookingService.getBooking(params[0]);

    if (booking) {
      const bookingEvents = booking.properties.Event.relation;
      const eventId = bookingEvents.length > 0 ? bookingEvents[0].id : null;
      const eventService = tijaService('events');
      const event = await eventService.getEvent(eventId);
      return {
        props: { booking, event },
      };
    }
  } catch (err) {
    //
  }

  return {
    notFound: true,
  };
};

export default PaymentCancelled;
