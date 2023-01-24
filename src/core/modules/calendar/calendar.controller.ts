import { Get, Param } from 'next-api-decorators';
import Container from 'typedi';

import { CalendarService } from './calendar.service';

export class CalendarController {
  constructor(
    private calendarService: CalendarService = Container.get(CalendarService)
  ) {}

  @Get()
  public foo() {
    return this.calendarService.getAllCalendars();
  }

  @Get('/:eventId')
  public details(@Param('eventId') eventId: string) {
    return this.calendarService.getCalendar(eventId);
  }
}
