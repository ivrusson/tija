import { Button } from 'antd';
import { useState } from 'react';

import { getPaymentLink } from '@/lib/api';

import { getFromRichText } from '@/components/events/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  booking: any;
  event: any;
}

const CancelledCard: React.FC<Props> = ({ booking, event }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const goToCheckout = async () => {
    setLoading(true);
    const paymentLink = await getPaymentLink(
      {
        bookingId: booking.id,
        priceId: getFromRichText(
          event.properties.Product.properties['Stripe Price Id']
        ),
      },
      {}
    );

    if (paymentLink.url) {
      window.open(paymentLink.url, '_blank');
    }
    setLoading(false);
  };

  return (
    <div className='completed-payment-card'>
      <div className='boder-gray-200 rounded-lg border bg-white p-4 shadow-lg'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='col-span-12'>
            <div className='flex min-h-[320px] place-items-center'>
              <div className='w-full text-center'>
                <h2>😵 Something goes wrong!</h2>
                <p>Try to pay again with the following button:</p>

                <div className='mb-4'>
                  <Button
                    type='primary'
                    size='large'
                    loading={loading}
                    onClick={() => goToCheckout()}
                  >
                    Try payment again
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-span-12'></div>
        </div>
      </div>
    </div>
  );
};

export default CancelledCard;
