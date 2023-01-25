/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { NotionProvider } from '@/core/providers/notion/notion.service';

@Service()
export class CalendarRepository {
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
  async getCalendar(): Promise<any> {
    return this.notionProvider.queryDatabase();
  }
}
