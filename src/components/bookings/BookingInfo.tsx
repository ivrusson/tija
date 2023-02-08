/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { cancelBooking } from '@/lib/api';

import { EventInfo } from '@/components/events/EventInfo';

interface Props {
  booking: any;
  event: any;
  csrfToken: string;
}

export const BookingInfo: React.FC<Props> = ({ booking, event, csrfToken }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, contextHolder] = Modal.useModal();

  const status = booking?.properties?.Status?.status || null;

  const date = booking?.properties?.Date?.date || null;

  const onCancelBooking = () => {
    modal.confirm({
      title: 'Do you want to cancel this event?',
      content:
        'Are you sure you want to cancel this event. This cannot be undone.',
      okText: 'Confirm cancellation',
      okButtonProps: {
        loading,
        disabled: loading,
        danger: true,
      },
      onOk: async () => {
        setLoading(true);
        // Cancel the event
        const cancelled = await cancelBooking(booking.id, { csrfToken });
        console;
        if (cancelled?.url) {
          router.reload();
        }

        setLoading(false);
      },
    });
  };

  const onBookAgain = () => {
    router.push(`/events/${event.id}`);
  };

  return (
    <>
      <div className='boder-gray-200 rounded-lg border bg-white p-4 shadow-lg'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='col-span-12 md:col-span-4'>
            {event && <EventInfo event={event} />}
          </div>
          <div className='col-span-12 p-4 md:col-span-8'>
            <div className='mb-2 flex'>
              <div className='text-sm font-bold text-gray-700'>
                Event Status:
              </div>
            </div>
            <div className='mb-4 flex'>
              {status && (
                <div
                  className={`status-badge w-auto ${status.name.replaceAll(
                    ' ',
                    ''
                  )}`}
                >
                  {status.name}
                </div>
              )}
            </div>
            <div className='mb-2 flex'>
              <div className='text-sm font-bold text-gray-700'>Event Date:</div>
            </div>
            <div className='mb-4 flex'>
              {date && date.start && (
                <div className='text-gray-500'>
                  {dayjs(date.start).format('dddd, MMMM D, YYYY h:mm A')}
                </div>
              )}
            </div>
          </div>
          <div className='col-span-12'>
            <div className='flex items-center justify-between'>
              <div></div>
              {status && ['Pending', 'In Progress'].includes(status?.name) && (
                <Button
                  type='primary'
                  size='large'
                  danger
                  onClick={() => onCancelBooking()}
                >
                  <div className='flex items-center justify-center gap-2'>
                    <div>Cancel booking</div>
                  </div>
                </Button>
              )}
              {status && ['Cancelled', 'Rejected'].includes(status?.name) && (
                <Button
                  type='primary'
                  size='large'
                  onClick={() => onBookAgain()}
                >
                  <div className='flex items-center justify-center gap-2'>
                    <div>Book again</div>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='px-2'>
        {/* <div className='mb-2 flex items-center justify-start gap-1 text-sm text-gray-300'>
          <RiTimeLine className='h-4 w-4' />
          <div>{getFromNumber(booking.properties.Duration)} min</div>
        </div>
        <div className='mb-4 flex items-center justify-start text-lg text-gray-500'>
          {getFromRichText(booking.properties.Description)}
        </div> */}
        {/* <div className='mt-2'>
          <pre className='flex-wrap bg-gray-900 text-white'>
            {JSON.stringify(booking, null, 2)}
          </pre>
        </div> */}
      </div>
      {contextHolder}
    </>
  );
};
