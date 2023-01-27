/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIErrorCode, Client } from '@notionhq/client';
import {
  CreatePageParameters,
  CreatePageResponse,
  GetPageResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from 'next-api-decorators';
import { Service } from 'typedi';

import { ConfigService } from '@/core/config/config.service';
import findProperties from '@/core/providers/notion/helpers/findProperties';
import { parseKeyDatabase } from '@/core/providers/notion/helpers/parseKeyDatabase';

type NotionPageResponse = GetPageResponse & PageObjectResponse;

@Service()
export class NotionProvider {
  private client;
  constructor(private configService: ConfigService) {
    this.client = new Client({ auth: configService.get('notionApiToken') });
  }

  public queryDatabase(databaseKey: string, filter: any, sort: any) {
    const databaseId = this.configService.get(databaseKey) as string;
    const databaseName = parseKeyDatabase(databaseKey);

    if (!databaseId) {
      throw new NotFoundException(`Database not found: ${databaseName}`);
    }

    try {
      const query = this.buildQuery(databaseId, filter, sort);
      const results = this.client.databases.query(query);
      return results;
    } catch (err: any) {
      if (err.code === APIErrorCode.ObjectNotFound) {
        throw new NotFoundException(
          `Object not found in database: ${databaseName}`
        );
      } else {
        throw new UnauthorizedException(
          `Action not permitted in database: ${databaseName}`
        );
      }
    }
  }

  private buildQuery(databaseId: string, filter?: any, sort?: any) {
    const query: any = {
      database_id: databaseId,
    };
    if (typeof filter === 'object') {
      query.filter = filter;
    }
    if (typeof sort === 'object') {
      query.sort = sort;
    }
    return query;
  }

  public async getPage(
    databaseKey: string,
    pageId: string
  ): Promise<NotionPageResponse> {
    const databaseId = this.configService.get(databaseKey) as string;
    const databaseName = parseKeyDatabase(databaseKey);

    if (!databaseId) {
      throw new NotFoundException(`Database not found: ${databaseName}`);
    }

    try {
      const page = (await this.client.pages.retrieve({
        page_id: pageId,
      })) as NotionPageResponse;

      const parent = page.parent;
      if (
        parent?.type === 'database_id' &&
        parent?.database_id === databaseId
      ) {
        return page;
      }
      return page; // TODO: return pageMapper(page);
    } catch (err) {
      throw new NotFoundException(`Pa`);
    }
  }

  public async getPageWithRelations(
    databaseKey: string,
    pageId: string,
    relations?: string[]
  ): Promise<
    NotionPageResponse & { relations: Promise<NotionPageResponse>[] }
  > {
    const databaseId = this.configService.get(databaseKey) as string;
    const databaseName = parseKeyDatabase(databaseKey);

    if (!databaseId) {
      throw new NotFoundException(`Database not found: ${databaseName}`);
    }

    try {
      const page = await this.getPage(databaseKey, pageId);
      const rels = Array.isArray(relations)
        ? findProperties(page, relations)
        : [];

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
      throw new NotFoundException(`Database not found: ${databaseName}`);
    }
  }

  public async createPage(
    databaseKey: string,
    data: CreatePageParameters
  ): Promise<CreatePageResponse> {
    const databaseId = this.configService.get(databaseKey) as string;
    const databaseName = parseKeyDatabase(databaseKey);

    if (!databaseId) {
      throw new NotFoundException(`Database not found: ${databaseName}`);
    }

    try {
      const page = await this.client.pages.create(data);

      return page;
    } catch (err) {
      throw new ConflictException(
        `Error creating object for database: ${databaseName}`
      );
    }
  }

  public async updatePage(pageId: string, data: any) {
    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        properties: data,
      });
      return response;
    } catch (err) {
      throw new ConflictException(
        `Error updating object`
      );
    }
  }
}
