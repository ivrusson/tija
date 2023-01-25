/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { EventRepository } from './event.repository';

@Service()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}
  async getAllEvents(): Promise<any[]> {
    const result = await this.eventRepository.getAllEvents();
    return result;
  }
  async getEvent(eventId: string): Promise<any> {
    const result = await this.eventRepository.getEvent(eventId);
    return result;
  }
  async getCalendar(eventId: string): Promise<any> {
    const result = await this.eventRepository.getEvent(eventId);
    return result;
  }
}
