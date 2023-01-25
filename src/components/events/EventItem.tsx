import { Button } from 'antd';
import { useRouter } from 'next/router';
import { FiExternalLink } from 'react-icons/fi';

import { EventInfo } from '@/components/events/EventInfo';
import Share from '@/components/events/Share';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  event: any;
}

const EventItem: React.FC<Props> = ({ event }) => {
  const router = useRouter();
  return (
    <div key={event.id} className='event-item'>
      <div className='bodergray-200 rounded-lg border bg-white p-4 shadow-lg'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='col-span-12'>
            <EventInfo event={event} />
            <div className='flex items-center justify-between'>
              <div className='float-right'>
                <Share event={event} />
              </div>
              <div className='float-right'>
                <Button onClick={() => router.push(`/events/${event.id}`)}>
                  <div className='flex items-center justify-center gap-2'>
                    <div>Book now</div>
                    <FiExternalLink className='h-4 w-4' />
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className='col-span-12'></div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
