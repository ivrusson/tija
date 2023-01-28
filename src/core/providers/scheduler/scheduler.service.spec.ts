/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@/core/config/config.service';

import {
  SchedulerBooking,
  SchedulerService,
  SchedulerWorkingPlan,
} from './scheduler.service';

const START_DATE = '2023-01-10';
const END_DATE = '2023-01-15';

const TEST_BOOKINGS: SchedulerBooking[] = [];
const TEST_WORKING_PLANS: SchedulerWorkingPlan[] = [
  {
    Type: 'Open Hours',
    Dates: {
      start: '2023-01-10 10:00',
      end: '2023-01-10 16:00',
      time_zone: null,
    },
    Break: {
      start: '2023-01-10 12:00',
      end: '2023-01-10 14:00',
      time_zone: null,
    },
    Weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    Type: 'Closed',
    Dates: {
      start: '2023-01-11',
      end: null,
      time_zone: null,
    },
  },
  {
    Type: 'Override Date',
    Dates: {
      start: '2023-01-12 11:00',
      end: '2023-01-12 14:00',
      time_zone: null,
    },
    Break: {
      start: '2023-01-12 12:00',
      end: '2023-01-12 13:00',
      time_zone: null,
    },
  },
];

const BASE_HOURS = [
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00',
  '15:15',
  '15:30',
  '15:45',
];

class MockConfigService extends ConfigService {
  constructor() {
    super();
  }
  get() {
    return {};
  }
}

const configService = new MockConfigService();

describe('scheduler service test', () => {
  const schedulerService = new SchedulerService(
    configService,
    START_DATE,
    END_DATE,
    TEST_BOOKINGS,
    TEST_WORKING_PLANS
  );

  it('should return and array of times', () => {
    const DATE_STR = '2023-01-15';
    const START_DATE_STR = '2023-01-10 10:00';
    const END_DATE_STR = '2023-01-15 12:00';

    const getTimeStamp = (hour: string) => {
      const splitDate = DATE_STR.split('-').map(n => parseInt(n));
      const hourDate = hour.split(':').map(n => parseInt(n));
      new Date(Date.UTC(splitDate[0], splitDate[1], splitDate[2], hourDate[0], hourDate[1])).getTime()
    }

    const EXPECTED_ARRAY = [
      '10:00',
      '10:15',
      '10:30',
      '10:45',
      '11:00',
      '11:15',
      '11:30',
      '11:45',
    ].map(n => getTimeStamp(n));

    const times = schedulerService.buildHours(DATE_STR, START_DATE_STR, END_DATE_STR);

    expect(times).toEqual(EXPECTED_ARRAY);
  });

  it('should return a valid date string', () => {
    const DATE_STR = '2023/01/10 10:00';

    const EXPECTED_DATE = '2023-01-10';

    const date = schedulerService.getDateString(DATE_STR);

    expect(date).toEqual(EXPECTED_DATE);
  });

  it('should return a valid scheduler', async () => {
    const scheduler = await schedulerService.getScheduler();

    const EXPECTED_SCHEDULER = {
      startDate: START_DATE,
      endDate: END_DATE,
      dates: [
        { date: '2023-01-10', times: BASE_HOURS },
        { date: '2023-01-11', times: [] },
        {
          date: '2023-01-12',
          times: [
            '11:00',
            '11:15',
            '11:30',
            '11:45',
            '13:00',
            '13:15',
            '13:30',
            '13:45',
          ],
        },
        { date: '2023-01-13', times: BASE_HOURS },
        { date: '2023-01-14', times: [] }, // Is saturday and is disabled
        { date: '2023-01-15', times: [] }, // Is sunday and is disabled
      ],
    };

    expect(scheduler).toEqual(EXPECTED_SCHEDULER);
  });
});
