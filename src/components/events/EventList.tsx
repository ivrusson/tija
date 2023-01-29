import EventItem from '@/components/events/EventItem';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  events: any[];
}

const EventList = ({ events }: Props) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-0'>
      {events.map((event: any) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
