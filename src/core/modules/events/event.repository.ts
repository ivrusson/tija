/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { NotionProvider } from '@/core/providers/notion/notion.service';

import { ConfigService } from '../../config/config.service';

@Service()
export class EventRepository {
  private tijaConfig: any;
  constructor(
    private notionProvider: NotionProvider,
    private configservice: ConfigService
  ) {
    this.setConfig();
  }

  async setConfig() {
    const serverRuntimeConfig = this.configservice.get('serverRuntimeConfig');
    this.tijaConfig = await serverRuntimeConfig.tijaConfig;
  }

  async getAllEvents(): Promise<any> {
    return this.notionProvider.queryDatabase();
  }
  async getEvent(eventId: string): Promise<any> {
    return this.notionProvider.getPageWithRelations(eventId, [
      'Customer',
      'Event',
    ]);
  }
}
