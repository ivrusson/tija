/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { useState } from 'react';

import CalendarStep from '@/components/events/form/CalendarStep';
import CustomerStep from '@/components/events/form/CustomerStep';
import ResumeStep from '@/components/events/form/ResumeStep';

dayjs.extend(dayLocaleData);

interface Props {
  event: any;
}

const EventForm = ({ event }: Props) => {
  const [data, setData] = useState<any>({
    eventId: event.id,
  });
  const [step, setStep] = useState<string>('calendar');

  return (
    <div className=''>
      {step === 'calendar' && (
        <CalendarStep
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
          event={event}
          data={data}
          onStep={(step) => setStep(step)}
          onSubmit={(values) => {
            setData({
              ...data,
              ...values,
            });
            setStep('resume');
          }}
        />
      )}
      {step === 'resume' && <ResumeStep event={event} data={data} />}
    </div>
  );
};

export default EventForm;
