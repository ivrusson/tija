/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transition } from '@headlessui/react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { calendarLinkGanerator } from '@/lib/helper';

import { EventInfo } from '@/components/events/EventInfo';
import {
  getFromNumber,
  getFromRichText,
  getFromTitle,
} from '@/components/events/utils';

dayjs.extend(dayLocaleData);
interface Props {
  event: any;
  data: any;
}

const ResumeStep = ({ event, data }: Props) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const googleCalendarLink = calendarLinkGanerator('google', {
    ...data,
    event: {
      title: getFromTitle(event.properties.Name),
      description: getFromRichText(event.properties.Description),
      duration: getFromNumber(event.properties.Duration),
    },
  });

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
      <div className='mx-auto'>
        <div className='bodergray-200 rounded-lg border bg-white p-4 shadow-lg'>
          <div className='grid grid-cols-12 gap-2'>
            <div className='relative col-span-12 md:col-span-4'>
              <EventInfo event={event} />
              <div className='absolute right-0 top-0 h-full w-[1px] bg-gray-200  hidden md:visible' />
            </div>
            <div className='relative col-span-12 md:col-span-6 p-4'>
              <h3 className='text-2xl font-bold text-gray-700'>
                Book confirmed
              </h3>
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
                <Link href='/events' className='text-lg'>
                  Do you want to create another event?
                </Link>
              </div>
              <div>
                <Button
                  onClick={() => window.open(googleCalendarLink, '_blank')}
                >
                  Add to Google Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default ResumeStep;
