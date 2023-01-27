/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transition } from '@headlessui/react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { useEffect, useState } from 'react';

import { getPaymentLink } from '@/lib/api';

import { EventInfo } from '@/components/events/EventInfo';
import { getFromRichText } from '@/components/events/utils';

dayjs.extend(dayLocaleData);
interface Props {
  event: any;
  data: any;
}

const CheckoutStep = ({ event, data }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const goToCheckout = async () => {
    setLoading(true);
    const paymentLink = await getPaymentLink(
      {
        bookingId: data.booking.id,
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
    <Transition
      show={show}
      enter='transition duration-500 ease-out'
      enterFrom='transform scale-95 opacity-0'
      enterTo='transform scale-100 opacity-100'
      leave='transition duration-500 ease-out'
      leaveFrom='transform scale-100 opacity-100'
      leaveTo='transform scale-95 opacity-0'
    >
      <div className='mx-auto my-8'>
        <div className='bodergray-200 rounded-lg border bg-white p-4 shadow-lg'>
          <div className='grid grid-cols-12 gap-2'>
            <div className='relative col-span-4'>
              <EventInfo event={event} />
              <div className='absolute right-0 top-0 h-full w-[1px] bg-gray-200' />
            </div>
            <div className='relative col-span-6 p-4'>
              <h3 className='text-2xl font-bold text-gray-700'>Checkout</h3>
              <div className='mb-2'>
                <div className='text font-bold text-gray-700'>Booked day:</div>
                <div className='text-lg text-gray-700'>
                  {data.currentTime &&
                    data.currentTime.format('dddd, MMMM D, YYYY h:mm A')}
                </div>
              </div>
              <div className='mb-2'>
                <div className='text font-bold text-gray-700'>Name:</div>
                <div className='text-lg text-gray-700'>
                  {[data.firstName, data.lastName].join(' ')}
                </div>
              </div>
              <div className='mb-2'>
                <div className='text font-bold text-gray-700'>Email:</div>
                <div className='text-lg text-gray-700'>{data.email}</div>
              </div>
              <div className='mb-4'>
                <div className='text font-bold text-gray-700'>Phone:</div>
                <div className='text-lg text-gray-700'>
                  {[`+${data.prefix}`, data.phone].join(' ')}
                </div>
              </div>
              <div className='mb-4'>
                <Button
                  type='primary'
                  size='large'
                  loading={loading}
                  onClick={() => goToCheckout()}
                >
                  Continue to payment
                </Button>
              </div>
              {/* <div>{JSON.stringify(data, null, 2)}</div> */}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default CheckoutStep;
