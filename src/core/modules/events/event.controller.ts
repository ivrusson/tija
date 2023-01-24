import { Get, Param } from 'next-api-decorators';
import Container from 'typedi';

import { EventService } from '@/core/modules/events/event.service';

export class EventController {
  constructor(
    private eventService: EventService = Container.get(EventService)
  ) {}

  @Get()
  public getEvents() {
    return this.eventService.getAllEvents();
  }

  @Get('/:eventId')
  public getEvent(@Param('eventId') eventId: string) {
    return this.eventService.getEvent(eventId);
  }

  @Get('/:eventId/calendar')
  public getCalendar(@Param('eventId') eventId: string) {
    return this.eventService.getEvent(eventId);
  }
}