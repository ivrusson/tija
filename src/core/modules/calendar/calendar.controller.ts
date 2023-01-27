import { Get, Param } from 'next-api-decorators';
import Container from 'typedi';

import { CsrfToken } from '@/core/common/decorators/csrf.decorator';

import { CalendarService } from './calendar.service';

export class CalendarController {
  constructor(
    private calendarService: CalendarService = Container.get(CalendarService)
  ) { }

  @CsrfToken()
  @Get('/:eventId/:startDate/:endDate')
  public details(
    @Param('eventId') eventId: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string
  ) {
    return this.calendarService.getCalendar({
      eventId,
      startDate,
      endDate,
    });
  }
}
