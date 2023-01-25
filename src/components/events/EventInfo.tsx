/* eslint-disable @typescript-eslint/no-explicit-any */

import { RiTimeLine } from 'react-icons/ri';

import {
  getFromNumber,
  getFromRichText,
  getFromTitle,
} from '@/components/events/utils';

interface Props {
  event: any;
}

export const EventInfo: React.FC<Props> = ({ event }) => {
  return (
    <>
      <h1 className='text-2xl font-bold text-gray-700'>
        {event.icon && event.icon.type === 'emoji' && event.icon.emoji}
        {getFromTitle(event.properties.Name)}
      </h1>
      <div className='px-2'>
        <div className='mb-2 flex items-center justify-start gap-1 text-sm text-gray-300'>
          <RiTimeLine className='h-4 w-4' />
          <div>{getFromNumber(event.properties.Duration)} min</div>
        </div>
        <div className='mb-4 flex items-center justify-start text-lg text-gray-500'>
          {getFromRichText(event.properties.Description)}
        </div>
      </div>
    </>
  );
};
