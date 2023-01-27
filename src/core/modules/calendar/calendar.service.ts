/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { BookingRepository } from '@/core/modules/bookings/booking.repository';
import { WorkingPlanRepository } from '@/core/modules/working-plans/working-plan.repository';
import pageMapper from '@/core/providers/notion/helpers/pageMapper';
import {
  SchedulerService,
} from '@/core/providers/scheduler/scheduler.service';

import { ConfigService } from '../../config/config.service';

@Service()
export class CalendarService {
  constructor(
    private configService: ConfigService,
    private bookingRepository: BookingRepository,
    private readonly workingPlanRepository: WorkingPlanRepository
  ) { }
  async getCalendar({
    eventId,
    startDate,
    endDate,
  }: {
    eventId: string;
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const bookings = await this.getCalendarBookings({
      startDate,
      endDate,
    });
    const workingPlans = await this.getCalendarWorkingPlans(eventId);
    const schedulerService = new SchedulerService(
      this.configService,
      startDate,
      endDate,
      bookings,
      workingPlans
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
      and: [
        {
          property: 'Date',
          date: {
            after: startDate,
          },
        },
        {
          property: 'Date',
          date: {
            before: endDate,
          },
        },
      ],
    };

    try {
      const response = await this.bookingRepository.getBookings(filter);
      if (response.results && Array.isArray(response.results)) {
        return response.results.map((result: any) => pageMapper(result));
      }
    } catch (err) {
      return [];
    }
  }

  async getCalendarWorkingPlans(eventId: string) {
    const filter = {
      property: "Events",
      relation: {
        contains: eventId
      }
    };

    try {
      const response = await this.workingPlanRepository.getWorkingPlans(filter);
      if (response.results && Array.isArray(response.results)) {
        return response.results.map((result: any) => pageMapper(result));
      }
    } catch (err) {
      return [];
    }
  }

}
