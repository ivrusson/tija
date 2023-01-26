/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { BookingRepository } from '@/core/modules/bookings/booking.repository';
import { WorkingPlanRepository } from '@/core/modules/working-plans/working-plan.repository';
import {
  SchedulerService,
  SchedulerWorkingPlan,
} from '@/core/providers/scheduler/scheduler.service';

import { ConfigService } from '../../config/config.service';

const mock: SchedulerWorkingPlan[] = [
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
      start: '2023-01-25',
      end: null,
      time_zone: null,
    },
  },
  {
    Type: 'Override Date',
    Dates: {
      start: '2023-01-24 11:00',
      end: '2023-01-24 14:00',
      time_zone: null,
    },
    Break: {
      start: '2023-01-24 12:00',
      end: '2023-01-24 13:00',
      time_zone: null,
    },
  },
];

@Service()
export class CalendarService {
  constructor(
    private configService: ConfigService,
    private bookingRepository: BookingRepository,
    private readonly workingPlanRepository: WorkingPlanRepository
  ) { }
  async getCalendar({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const workingplans = mock;
    const schedulerService = new SchedulerService(
      this.configService,
      startDate,
      endDate,
      [],
      workingplans
    );
    const scheduler = schedulerService.getScheduler();
    return scheduler;
  }

  async getCalendarBookings({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    const filter = {
      "and": [
        {
          "date": "Date",
          "number": {
            "greater_than": startDate
          }
        },
        {
          "property": "Date",
          "date": {
            "lower_than": endDate
          }
        },
      ]
    };
    this.bookingRepository.getBookings(filter);
  }
}
