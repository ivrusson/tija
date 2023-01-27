/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';
import { uuid } from 'uuidv4';

import { ConfigService } from '@/core/config/config.service';
import { toNotionFields } from '@/core/providers/notion/helpers/valueToField';
import { NotionProvider } from '@/core/providers/notion/notion.service';

@Service()
export class OrderRepository {
  constructor(private configService: ConfigService, private notionProvider: NotionProvider) { }

  async createOrder(data: any): Promise<any> {
    try {
      const orderLine = await this.createOrderLine(data);
      const orderLineId = orderLine.id;
      const booking = {
        parent: toNotionFields.parent(this.configService.get('DB_ORDERS')),
        properties: {
          'Order ID': toNotionFields.title(uuid()),
          Status: toNotionFields.status('Waiting Payment'),
          'Order Items': toNotionFields.relations([{ id: orderLineId }]),
        },
      };
      try {
        const response = await this.notionProvider.createPage(
          'DB_ORDERS',
          booking
        );
        return response;
      } catch (err) {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async createOrderLine(data: any): Promise<any> {
    const orderLine = {
      parent: toNotionFields.parent(this.configService.get('DB_ORDER_LINES')),
      properties: {
        'Line ID': toNotionFields.title(uuid()),
        Product: toNotionFields.relations([{ id: data.product.id }]),
        Quantity: toNotionFields.number(data.product.quantity),
      },
    };
    try {
      const response = await this.notionProvider.createPage(
        'DB_ORDER_LINES',
        orderLine
      );
      return response;
    } catch (err) {
      return null;
    }
  }

  public async updateOrder(orderId: string, data: any) {
    return await this.notionProvider.updatePage(orderId, data);
  }

}