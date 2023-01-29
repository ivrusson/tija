/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transition } from '@headlessui/react';
import { Button, Calendar, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { useCallback, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

import { useCalendar } from '@/hooks/useCalendar';
import useTheme from '@/hooks/useTheme';

import { EventInfo } from '@/components/events/EventInfo';
import Share from '@/components/events/Share';

dayjs.extend(dayLocaleData);

interface Props {
  csrfToken: string;
  event: any;
  onSubmit: (data: any) => void;
}

const SAFE_DATE_FORMAT = 'YYYY-MM-DD';
const SAFE_TIME_FORMAT = 'HH:mm';

const CalendarStep = ({ csrfToken, event, onSubmit }: Props) => {
  const { color } = useTheme();
  const [show, setShow] = useState<boolean>(false);
  const { loading, times, currentDate, currentTime, updateDate, updateTime } =
    useCalendar({
      eventId: event.id,
      csrfToken,
    });

  useEffect(() => {
    setShow(true);
  }, []);

  const onDateChange = useCallback(
    (value: Dayjs) => {
      updateDate(value);
    },
    [updateDate]
  );

  const disableDate = useCallback((currentDate: Dayjs) => {
    if (currentDate.valueOf() > dayjs().subtract(1, 'd').valueOf()) {
      return false;
    }
    return true;
  }, []);

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
      <div className='mx-auto w-full'>
        <div className='boder-gray-200 rounded-lg border bg-white p-4 shadow-lg'>
          <div className='grid grid-cols-12 gap-2'>
            <div className='relative col-span-12 md:col-span-4'>
              <EventInfo event={event} />
              <div className='absolute right-0 top-0 hidden h-full w-[1px]  bg-gray-200 md:visible' />
            </div>
            <div className='relative col-span-12 p-2 md:col-span-5'>
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
                          <RiArrowLeftLine
                            className={`text-${color}-500 h-6 w-6`}
                          />
                        </Button>
                        <Button
                          type='link'
                          onClick={() => handleMonthChange('add')}
                        >
                          <RiArrowRightLine
                            className={`text-${color}-500 h-6 w-6`}
                          />
                        </Button>
                      </div>
                    </div>
                  );
                }}
                fullscreen={false}
                onChange={onDateChange}
                disabledDate={disableDate}
              />
              <div className='absolute right-0 top-0 hidden h-full w-[1px]  bg-gray-200 md:visible' />
            </div>
            <div className='relative col-span-12 h-36 pl-2 md:col-span-3 md:h-full'>
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
                      <div
                        className={`mr-2 h-12 w-2 rounded-full bg-${color}-700 bg-opacity-50`}
                      ></div>
                    )}
                  >
                    <div className='grid w-full grid-cols-1 gap-2 pr-4'>
                      {times.map((time) => {
                        const dayStr = currentDate.format(SAFE_DATE_FORMAT);
                        const timeStr = dayjs(time).format(SAFE_TIME_FORMAT);
                        const dateFromTime = dayjs(`${dayStr} ${timeStr}`);
                        const currentTimeDateStr = currentTime?.format(
                          `${SAFE_DATE_FORMAT} ${SAFE_TIME_FORMAT}`
                        );
                        const currentDateStr = `${dayStr} ${timeStr}`;

                        return (
                          <Button
                            key={time}
                            type={
                              currentTimeDateStr === currentDateStr
                                ? 'primary'
                                : 'default'
                            }
                            onClick={() => updateTime(dateFromTime)}
                          >
                            <span className='text-md'>
                              {dateFromTime.format(SAFE_TIME_FORMAT)}
                            </span>
                          </Button>
                        );
                      })}
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
              <div className='flex flex-col-reverse items-center justify-between md:flex-row'>
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
