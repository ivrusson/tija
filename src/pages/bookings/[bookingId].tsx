/* eslint-disable @typescript-eslint/no-explicit-any */

import { BookingInfo } from '@/components/bookings/BookingInfo';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { tijaService } from '@/core';
import { csrf } from '@/core/csrf';
import { withTijaSsr } from '@/core/routers';
import { NextPageWithLayout } from '@/pages/_app';

interface Props {
  csrfToken: string;
  bookingId: string;
  booking: any;
  event: any;
}

const Booking: NextPageWithLayout<Props> = ({ csrfToken, booking, event }) => {
  return (
    <Layout>
      <div className='page page-booking min-h-full'>
        <Seo templateTitle='Booking page' />
        <BookingInfo booking={booking} event={event} csrfToken={csrfToken} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = withTijaSsr(async (context) => {
  const { req, res, query } = context;
  await csrf(req, res);

  const { bookingId } = query;
  const bookingService = tijaService('bookings');
  const booking = await bookingService.getBooking(bookingId);

  let event = null;
  if (
    booking?.properties?.Event?.relation &&
    booking?.properties?.Event?.relation.length >= 1
  ) {
    const eventService = tijaService('events');
    event = await eventService.getEvent(
      booking?.properties?.Event.relation[0].id
    );
  }

  const token = req.csrfToken();
  return {
    props: {
      csrfToken: token as string,
      bookingId,
      booking,
      event,
    },
  };
});

export default Booking;
