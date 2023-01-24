/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import getConfig from 'next/config';
import { Service, ServiceNotFoundError } from 'typedi';

import findProperties from '@/core/providers/notion/helpers/findProperties';

@Service()
export class NotionProvider {
  private client;
  constructor() {
    const { serverRuntimeConfig } = getConfig();
    this.client = new Client({ auth: serverRuntimeConfig.notion_api_token });
  }

  public async getPage(pageId: string): Promise<any> {
    try {
      const page = await this.client.pages.retrieve({ page_id: pageId });
      return page; // TODO: return pageMapper(page);
    } catch (err) {
      throw new ServiceNotFoundError('notion');
    }
  }

  public async getPageWithRelations(
    pageId: string,
    relations: string[]
  ): Promise<any> {
    try {
      const page = (await this.client.pages.retrieve({
        page_id: pageId,
      })) as PageObjectResponse;
      const rels = findProperties(page, relations);

      const rel_keys: string[] = Object.keys(rels);

      for (let i = 0; i < rel_keys.length; i++) {
        const rel_obj = rels[rel_keys[i]];

        if (rel_obj.relation.length > 0) {
          if (!rel_obj.has_more) {
            rels[rel_keys[i]] = await this.client.pages.retrieve({
              page_id: rel_obj.relation[0].id,
            });
          } else {
            for (const rel of rel_obj.relation) {
              rels[rel_keys[i]] = await this.client.pages.retrieve({
                page_id: rel.id,
              });
            }
          }
        }
      }

      return {
        ...page,
        properties: {
          ...page.properties,
          ...rels,
        },
        relations: rels,
      }; // TODO: return pageMapper(page);
    } catch (err) {
      throw new ServiceNotFoundError('notion');
    }
  }
}
