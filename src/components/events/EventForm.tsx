import { Calendar } from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { Dayjs } from 'dayjs';

interface Props {
  event: any;
}

const EventForm = ({ event }: Props) => {
  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <div className='mx-auto my-8 w-[800px]'>
      <div className='bodergray-200 rounded-lg border bg-white p-4 shadow-lg'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='col-span-12'>
            <h1>
              {event.properties.Name.title
                .map((o: any) => o.plain_text)
                .join(' ')}
            </h1>
          </div>
          <div className='col-span-6'>
            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
          </div>
          <div className='col-span-6'></div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
