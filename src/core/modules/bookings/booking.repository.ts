/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { Service } from 'typedi';
import { uuid } from 'uuidv4';

import { NotionProvider } from '@/core/providers/notion/notion.service';

import { ConfigService } from '../../config/config.service';

@Service()
export class BookingRepository {
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
  async createCustomerFromBooking(data: any): Promise<any> {
    try {
      const response = await this.notionProvider.createPage({
        parent: {
          type: 'database_id',
          database_id: this.tijaConfig.DB_CUSTOMERS,
        },
        properties: {
          'Full Name': {
            title: [
              {
                text: {
                  content: [data.firstName, data.lastName].join(' '),
                },
              },
            ],
          },
          'First Name': {
            rich_text: [
              {
                text: {
                  content: data.firstName,
                },
              },
            ],
          },
          'Last Name': {
            rich_text: [
              {
                text: {
                  content: data.lastName,
                },
              },
            ],
          },
          Email: {
            email: data.email,
          },
          Phone: {
            phone_number: [`+${data.prefix}`, data.phone].join(' '),
          },
        },
      });
      return response;
    } catch (err) {
      return null;
    }
  }

  async createBooking(data: any): Promise<any> {
    try {
      const customer = await this.createCustomerFromBooking(data);
      const customerId = customer.id;
      try {
        const response = await this.notionProvider.createPage({
          parent: {
            type: 'database_id',
            database_id: this.tijaConfig.DB_BOOKINGS,
          },
          properties: {
            'Booking ID': {
              title: [
                {
                  text: {
                    content: uuid(),
                  },
                },
              ],
            },
            Date: {
              date: {
                start: dayjs(data.startDate).format(
                  'YYYY-MM-DDTHH:mm:00.000+00:00'
                ),
                end: dayjs(data.endDate).format(
                  'YYYY-MM-DDTHH:mm:00.000+00:00'
                ),
                time_zone: null,
              },
            },
            Status: {
              status: {
                name: 'Pending',
              },
            },
            Customer: {
              relation: [
                {
                  id: customerId,
                },
              ],
            },
            Booking: {
              relation: [
                {
                  id: data.eventId,
                },
              ],
            },
          },
        });
        return response;
      } catch (err) {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}
