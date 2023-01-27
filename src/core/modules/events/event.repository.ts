/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { NotionProvider } from '@/core/providers/notion/notion.service';

@Service()
export class EventRepository {
  constructor(private notionProvider: NotionProvider) { }

  async getEvents(filters: any, sort: any): Promise<any> {
    return this.notionProvider.queryDatabase('DB_EVENTS', filters, sort);
  }
  async getEvent(eventId: string): Promise<any> {
    return this.notionProvider.getPageWithRelations('DB_EVENTS', eventId, ['Product']);
  }
}
