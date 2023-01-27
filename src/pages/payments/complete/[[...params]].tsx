/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import CompletedCard from '@/components/payments/CompleteCard';
import Seo from '@/components/Seo';

import { tijaService } from '@/core';
import { toNotionFields } from '@/core/providers/notion/helpers/valueToField';
import { NextPageWithLayout } from '@/pages/_app';

interface Props {
  checkout: any;
}

const PaymentCompleted: NextPageWithLayout<Props> = ({ checkout }) => {
  return (
    <div className='page page-event'>
      <Seo templateTitle='Payment Complete' />
      <div className='py-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-white'>Payment Complete</h1>
        </div>
        <CompletedCard {...checkout} />
        {/* <div className='mt-2'>
          <pre className='flex-wrap bg-gray-900 text-white'>
            {JSON.stringify(checkout, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
};

PaymentCompleted.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params = [] } = context.query;
  if (!params[1]) {
    return {
      notFound: true,
    };
  }

  const paymentService = tijaService('payments');
  const checkout = await paymentService.getCheckout(params[1]);

  if (checkout.session && checkout.session.payment_status === 'paid') {
    const bookingService = tijaService('bookings');
    try {
      const booking = await bookingService.getBooking(params[0]);

      if (booking) {
        const bookingOrders = booking.properties.Order.relation;
        const orderId = bookingOrders.length > 0 ? bookingOrders[0].id : null;
        const bookingCustomers = booking.properties.Customer.relation;
        const customerId =
          bookingCustomers.length > 0 ? bookingCustomers[0].id : null;
        const orderService = tijaService('orders');
        orderService.updateOrder(orderId, {
          Status: toNotionFields.status('Payment Complete'),
          Customer: toNotionFields.relations([{ id: customerId }]),
          'Stripe Customer Id': toNotionFields.rich_text(
            checkout.session.customer
          ),
          'Stripe Payment Id': toNotionFields.rich_text(
            checkout.session.payment_intent
          ),
          'Stripe Invoice Id': toNotionFields.rich_text(checkout.invoice.id),
        });
      }
    } catch (err) {
      //
    }
  }

  return {
    props: { checkout },
  };
};

export default PaymentCompleted;
