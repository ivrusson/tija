/* eslint-disable @typescript-eslint/no-explicit-any */

import { RiTimeLine } from 'react-icons/ri';

import {
  containsProduct,
  getFromNumber,
  getFromNumberToPrice,
  getFromRichText,
  getFromTitle,
} from '@/components/events/utils';

interface Props {
  event: any;
}

export const EventInfo: React.FC<Props> = ({ event }) => {
  const product = event.properties.Product;
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
        {containsProduct(product) && (
          <>
            <div className='my-4 h-[1px] bg-gray-300' />
            <h2 className='text-sm font-bold text-gray-700'>
              This event contains a payment
            </h2>
            <div className=''>
              <div className='flex items-center justify-start text-lg text-gray-500'>
                {getFromTitle(product.properties.Name)}
              </div>
              <div className='mb-1 flex items-center justify-start text-xs text-gray-500'>
                {getFromRichText(product.properties.Description)}
              </div>
              <div className='flex items-center justify-start text-lg text-gray-500'>
                {getFromNumberToPrice(product.properties.Price)}
              </div>
            </div>
            <div className='my-4 h-[1px] bg-gray-300' />
          </>
        )}
      </div>
    </>
  );
};
