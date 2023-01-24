import { Service } from 'typedi';

import { NotionProvider } from '@/core/providers/notion/notion.service';

@Service()
export class EventRepository {
  constructor(private notionProvider: NotionProvider) {}

  async getAllEvents(): Promise<any[]> {
    return [];
  }
  async getEvent(eventId: string): Promise<any> {
    console.log('repository getEvent', eventId);
    return this.notionProvider.getPageWithRelations(eventId, [
      'Customer',
      'Event',
    ]);
  }
}
