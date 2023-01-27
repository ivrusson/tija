import { Service } from 'typedi';

import { ConfigService } from '@/core/config/config.service';

export type EmptyValue = null | undefined;

export type NotionFieldDate = {
  start: string | null;
  end: string | null;
  time_zone: string | null;
};

export const bookingStatus = {
  REJECTED: 'Rejected',
  PENDING: 'Pending',
  IN_PROGRESS: 'In progress',
  CANCELLED: 'Cancelled',
  COMPLETE: 'Complete',
} as const;

export const weekDays = {
  SUN: 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THURS: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
} as const;

export const workingPlanType = {
  OPEN: 'Open Hours',
  OVERRIDE: 'Override Date',
  CLOSED: 'Closed',
} as const;

export type BookingStatusEnum =
  (typeof bookingStatus)[keyof typeof bookingStatus];
export type SchedulerTypeEnum =
  (typeof workingPlanType)[keyof typeof workingPlanType];
export type WeekDayEnum = (typeof weekDays)[keyof typeof weekDays];

export interface SchedulerWorkingPlan {
  Type: SchedulerTypeEnum;
  Dates?: NotionFieldDate;
  Break?: NotionFieldDate;
  Weekdays?: WeekDayEnum[];
}

export interface SchedulerBooking {
  Status: BookingStatusEnum;
  Date: {
    start: string;
    end: string;
    time_zone: string | null;
  };
}

export type SchedulerItem = {
  date: string;
  times: string[];
};

export type Scheduler = {
  startDate: string;
  endDate: string;
  dates: SchedulerItem[];
};

const DEFAULT_SLOT_SIZE = 15;

const DEFAULT_BUFFER_SIZE = 15;

const DEFAULT_START_HOUR = '00:00';

const DEFAULT_END_HOUR = '23:59';

@Service()
export class SchedulerService {
  private slotSize: number = DEFAULT_SLOT_SIZE;
  private bufferSize: number = DEFAULT_BUFFER_SIZE;

  constructor(
    private configService: ConfigService,
    private startDate: string,
    private endDate: string,
    private bookings: SchedulerBooking[],
    private workinPlans: SchedulerWorkingPlan[]
  ) {
    const slotSize = this.configService.get('SLOT_SIZE');
    const bufferSize = this.configService.get('BUFFER_SIZE');
    this.slotSize = slotSize ? parseInt(slotSize) : DEFAULT_SLOT_SIZE;
    this.bufferSize = bufferSize ? parseInt(bufferSize) : DEFAULT_BUFFER_SIZE;
  }

  public async getScheduler(): Promise<Scheduler> {
    // First wee need to build Open and global times
    const openDates = await this.getOpenSchedulerItems();
    const overrideDates = await this.getOverrideSchedulerItems();
    const closedDates = await this.getClosedDates();

    const dates = openDates.map((item) => {
      if (closedDates.includes(item.date)) {
        return {
          ...item,
          times: [],
        };
      }
      const override = overrideDates.find(
        (overrideItem) => overrideItem.date === item.date
      );
      if (override) {
        return override;
      }
      return item;
    });

    return this.buildSchedulerOutput(dates);
  }

  public removeBookingFromDates(dates: SchedulerItem[]): SchedulerItem[] {
    const cleaned_dates = dates;
    this.bookings.forEach((booking: SchedulerBooking) => {
      if (booking.Date.start && booking.Date.end) {
        for (let i = 0; i < cleaned_dates.length; i++) {
          const dayString = this.getDateString(cleaned_dates[i].date);
          if (this.getDateString(booking.Date.start) === dayString) {
            const bookStartTimestamp = new Date(`${dayString} ${this.getHourString(booking.Date.start)}`).getTime();
            const bookEndTimestamp = new Date(`${dayString} ${this.getHourString(booking.Date.end)}`).getTime();

            const cleanedTimes = cleaned_dates[i].times.filter((time: string) => {
              const timestamp = new Date(`${dayString} ${time}`).getTime();
              if (bookStartTimestamp < timestamp && bookEndTimestamp > timestamp) {
                return true;
              }
              return false;
            });
            cleaned_dates[i].times = cleanedTimes;
          }
        }
      }
    });
    return cleaned_dates;
  }

  public async getOpenSchedulerItems(): Promise<SchedulerItem[]> {
    const openPlans = this.workinPlans.filter(
      (plan) => plan.Type === workingPlanType.OPEN
    );

    const items = this.getSchedulerItems(openPlans);

    return items;
  }

  public async getOverrideSchedulerItems(): Promise<SchedulerItem[]> {
    const overridePlans = this.workinPlans.filter(
      (plan) => plan.Type === workingPlanType.OVERRIDE
    );

    const items = this.getSchedulerItems(overridePlans, true);

    return items;
  }

  public async getSchedulerItems(
    plans: SchedulerWorkingPlan[],
    isOverride?: boolean
  ): Promise<SchedulerItem[]> {
    const items: SchedulerItem[] = [];

    // Generate a list of days between the requested dates
    const datesArray = this.getDatesArray(this.startDate, this.endDate);

    // Create the schedules object for each working plan
    plans.forEach((plan) => {
      if (!plan?.Dates?.start) {
        return [];
      }

      const times = this.geWorkingHours(plan?.Dates, plan?.Break);

      // Insert valid times to each day
      for (let i = 0; i < datesArray.length; i++) {
        const day = datesArray[i];
        if (isOverride) {
          const startDate = this.getDateString(plan?.Dates?.start);
          if (startDate === day) {
            items.push({
              date: this.getDateString(day),
              times: times,
            });
          }
        } else {
          // Check if is an allowed day of the week;
          const allowedDays = Array.isArray(plan?.Weekdays)
            ? plan.Weekdays.map((day) => Object.values(weekDays).indexOf(day))
            : [];
          const isDayAllowed = allowedDays.includes(new Date(day).getDay());
          items.push({
            date: this.getDateString(day),
            times: isDayAllowed ? times : [],
          });
        }
      }
    });

    return items;
  }

  public async getClosedDates(): Promise<string[]> {
    const closedPlans = this.workinPlans.filter(
      (plan) => plan.Type === workingPlanType.CLOSED
    );

    const items: string[] = [];

    // Create the schedules object for each working plan
    closedPlans.forEach((plan) => {
      const start = plan?.Dates?.start;
      const end = plan?.Dates?.end;

      if (start && end) {
        const closedArr = this.getDatesArray(start, end);
        closedArr.forEach((date) => items.push(this.getDateString(date)));
      } else if (start) {
        items.push(this.getDateString(start));
      }
    });

    return items;
  }

  public geWorkingHours(
    dates: NotionFieldDate | EmptyValue,
    breaks: NotionFieldDate | EmptyValue
  ) {
    let times: string[] = [];
    let disabledDates: string[] = [];

    // Build array of Dates times
    if (dates) {
      times = this.buildHours(dates.start, dates.end);
    }

    // Build array of disabled times
    if (breaks) {
      disabledDates = this.buildHours(breaks.start, breaks.end);
    }
    // Remove disabled times from avaiable times
    times = times.filter((hour) => !disabledDates.includes(hour));

    return times;
  }

  public buildHours(
    startTime: string | EmptyValue,
    endTime: string | EmptyValue
  ): string[] {
    // Must contain a valid date times
    if (!startTime || !endTime) {
      return [];
    }

    // Define start and end time to build the times slot array
    const dateStr = this.getDateString();

    const times = [];

    let currentTime = this.dateHasTime(startTime)
      ? new Date(`${dateStr} ${this.getHourString(startTime)}`).getTime()
      : new Date(`${dateStr} ${DEFAULT_START_HOUR}`).getTime();
    const stopTime = this.dateHasTime(endTime)
      ? new Date(`${dateStr} ${this.getHourString(endTime)}`).getTime()
      : new Date(`${dateStr} ${DEFAULT_END_HOUR}`).getTime();

    while (currentTime < stopTime) {
      // Insert the time
      times.push(this.getHourString(new Date(currentTime)));
      // Increase date mins to milliseconds
      currentTime += this.slotSize * 60000;
    }

    return times;
  }

  public dateHasTime(date: string): boolean {
    return /:/.test(date);
  }

  public getDateString(date?: string | Date): string {
    // Must return iso format: YYYY-MM-DD
    return (date ? new Date(date) : new Date()).toLocaleString('sv-SE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  public getHourString(date: string | Date): string {
    // Return 24h format string
    return new Date(date).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  public getDatesArray(startDate: string | Date, endDate: string | Date) {
    const dates: string[] = [];
    for (
      let currentDate = new Date(startDate);
      currentDate <= new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      dates.push(this.getDateString(currentDate));
    }
    return dates;
  }

  private buildSchedulerOutput(dates: SchedulerItem[] = []): Scheduler {
    return {
      startDate: this.startDate,
      endDate: this.endDate,
      dates,
    };
  }
}
