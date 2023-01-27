/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transition } from '@headlessui/react';
import { Button, Calendar, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

import { useCalendar } from '@/hooks/useCalendar';

import { EventInfo } from '@/components/events/EventInfo';
import Share from '@/components/events/Share';

dayjs.extend(dayLocaleData);

interface Props {
  csrfToken: string;
  event: any;
  onSubmit: (data: any) => void;
}

const SAFE_DATE_FORMAT = 'YYYY-MM-DD';

const CalendarStep = ({ csrfToken, event, onSubmit }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const { loading, times, currentDate, currentTime, updateDate, updateTime } =
    useCalendar({
      eventId: event.id,
      csrfToken,
    });

  useEffect(() => {
    setShow(true);
  }, []);

  const onDateChange = (value: Dayjs) => {
    updateDate(value);
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
      <div className='mx-auto my-8 w-full'>
        <div className='bodergray-200 rounded-lg border bg-white p-4 shadow-lg'>
          <div className='grid grid-cols-12 gap-2'>
            <div className='relative col-span-4'>
              <EventInfo event={event} />
              <div className='absolute right-0 top-0 h-full w-[1px] bg-gray-200' />
            </div>
            <div className='relative col-span-5 p-2'>
              <Calendar
                headerRender={({ value, onChange }) => {
                  const handleMonthChange = (type = 'add') => {
                    let month = 0;
                    switch (type) {
                      case 'add':
                        month = value.clone().add(1, 'M').month();
                        break;
                      case 'remove':
                        month = value.clone().subtract(1, 'M').month();
                        break;
                      default:
                        return;
                    }
                    const moveTo = value.clone().month(month);
                    onChange(moveTo);
                  };

                  return (
                    <div className='flex items-center justify-between'>
                      <div className='p-2 text-lg'>
                        {value.format('MMMM YYYY')}
                      </div>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          type='link'
                          onClick={() => handleMonthChange('remove')}
                        >
                          <RiArrowLeftLine className='h-6 w-6 text-purple-500' />
                        </Button>
                        <Button
                          type='link'
                          onClick={() => handleMonthChange('add')}
                        >
                          <RiArrowRightLine className='h-6 w-6 text-purple-500' />
                        </Button>
                      </div>
                    </div>
                  );
                }}
                fullscreen={false}
                onChange={onDateChange}
              />
              <div className='absolute right-0 top-0 h-full w-[1px] bg-gray-200' />
            </div>
            <div className='relative col-span-3 h-full pl-2'>
              <div className='relative mb-4 flex h-full w-full items-center justify-center'>
                {times.length === 0 ? (
                  <div className='flex h-full w-full items-center justify-center'>
                    <div className='text-gray-500'>No times available</div>
                  </div>
                ) : (
                  <Scrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    renderThumbVertical={() => (
                      <div className='mr-2 h-12 w-2 rounded-full bg-purple-700 bg-opacity-50'></div>
                    )}
                  >
                    <div className='grid w-full grid-cols-1 gap-2 pr-4'>
                      {times.map((time) => (
                        <Button
                          key={time}
                          type={
                            currentTime?.format(`${SAFE_DATE_FORMAT} HH:mm`) ===
                            `${currentDate.format(SAFE_DATE_FORMAT)} ${time}`
                              ? 'primary'
                              : 'default'
                          }
                          onClick={() =>
                            updateTime(
                              dayjs(
                                `${currentDate.format(
                                  SAFE_DATE_FORMAT
                                )} ${time}`
                              )
                            )
                          }
                        >
                          <span className='text-md'>{time}</span>
                        </Button>
                      ))}
                    </div>
                  </Scrollbars>
                )}
                {loading && (
                  <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white bg-opacity-50'>
                    <Spin />
                  </div>
                )}
              </div>
            </div>
            <div className='col-span-12 pt-2'>
              <div className='flex items-center justify-between'>
                <Share event={event} />
                <Button
                  className='min-w-[calc(25%)]'
                  type='primary'
                  size='large'
                  disabled={!currentTime || loading}
                  onClick={() =>
                    onSubmit({
                      currentTime,
                    })
                  }
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default CalendarStep;
