import { Service } from 'typedi';

import { CalendarRepository } from './calendar.repository';

@Service()
export class CalendarService {
  constructor(private readonly calendarRepository: CalendarRepository) {}
  async getAllCalendars(): Promise<any[]> {
    const result = await this.calendarRepository.getAllCalendars();
    return result;
  }
  async getCalendar(calendarId: string): Promise<any> {
    const result = await this.calendarRepository.getCalendar(calendarId);
    return result;
  }
}
