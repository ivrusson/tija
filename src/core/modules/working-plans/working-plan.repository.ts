/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { NotionProvider } from '@/core/providers/notion/notion.service';

@Service()
export class WorkingPlanRepository {
  private tijaConfig: any;
  constructor(private notionProvider: NotionProvider) { }

  async getWorkingPlans(filters: any, sort?: any): Promise<any> {
    return this.notionProvider.queryDatabase(
      'DB_WORKING_PLANS',
      filters,
      sort
    );
  }
}
