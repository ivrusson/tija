import { Service } from 'typedi';

import { NotionProvider } from '@/core/providers/notion/notion.service';

@Service()
export class CalendarRepository {
  constructor(private notionProvider: NotionProvider) {}

  async getAllCalendars(): Promise<any[]> {
    return [];
  }
  async getCalendar(eventId: string): Promise<any> {
    return this.notionProvider.getPageWithRelations(eventId, [
      'Customer',
      'Calendar',
    ]);
  }
}
