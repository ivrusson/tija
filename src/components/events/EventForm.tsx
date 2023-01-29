/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { useMemo, useState } from 'react';

import CalendarStep from '@/components/events/form/CalendarStep';
import CheckoutStep from '@/components/events/form/CheckoutStep';
import CustomerStep from '@/components/events/form/CustomerStep';
import ResumeStep from '@/components/events/form/ResumeStep';
import { containsProduct } from '@/components/events/utils';

dayjs.extend(dayLocaleData);

interface Props {
  csrfToken: string;
  event: any;
}

const EventForm = ({ csrfToken, event }: Props) => {
  const [data, setData] = useState<any>({
    eventId: event.id,
  });
  const [step, setStep] = useState<string>('calendar');

  const hasProduct: boolean = useMemo(
    () => containsProduct(event.properties.Product),
    [event.properties.Product]
  );

  return (
    <div className='event-form p-4 md:p-0'>
      {step === 'calendar' && (
        <CalendarStep
          csrfToken={csrfToken}
          event={event}
          onSubmit={(values) => {
            setData({
              ...data,
              ...values,
            });
            setStep('customer');
          }}
        />
      )}
      {step === 'customer' && (
        <CustomerStep
          csrfToken={csrfToken}
          event={event}
          data={data}
          onStep={(step) => setStep(step)}
          onSubmit={(values) => {
            setData({
              ...data,
              ...values,
            });
            if (hasProduct) {
              setStep('checkout');
            } else {
              setStep('resume');
            }
          }}
        />
      )}
      {step === 'checkout' && hasProduct && (
        <CheckoutStep event={event} data={data} />
      )}
      {step === 'resume' && <ResumeStep event={event} data={data} />}
    </div>
  );
};

export default EventForm;
