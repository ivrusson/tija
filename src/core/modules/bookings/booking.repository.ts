/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';
import { uuid } from 'uuidv4';

import { ConfigService } from '@/core/config/config.service';
import { toNotionFields } from '@/core/providers/notion/helpers/valueToField';
import { NotionProvider } from '@/core/providers/notion/notion.service';

@Service()
export class BookingRepository {
  private tijaConfig: any;
  constructor(private configService: ConfigService, private notionProvider: NotionProvider) { }
  async getBookings(filters?: any, sort?: any): Promise<any> {
    return this.notionProvider.queryDatabase('DB_BOOKINGS', filters, sort);
  }

  async getBooking(bookingId: string): Promise<any> {
    return this.notionProvider.getPage('DB_BOOKINGS', bookingId);
  }

  async createCustomerFromBooking(data: any): Promise<any> {
    const customer = {
      parent: toNotionFields.parent(this.configService.get('DB_CUSTOMERS')),
      properties: {
        'Full Name': toNotionFields.title(
          [data.firstName, data.lastName].join(' ')
        ),
        'First Name': toNotionFields.rich_text(data.firstName),
        'Last Name': toNotionFields.rich_text(data.lastName),
        Email: toNotionFields.email(data.email),
        Phone: toNotionFields.phone(data.phone),
      },
    };
    try {
      const response = await this.notionProvider.createPage(
        'DB_CUSTOMERS',
        customer
      );
      return response;
    } catch (err) {
      return null;
    }
  }

  async createBooking(data: any): Promise<any> {
    try {
      const customer = await this.createCustomerFromBooking(data);
      const customerId = customer.id;
      const booking = {
        parent: toNotionFields.parent(this.configService.get('DB_BOOKINGS')),
        properties: {
          'Booking ID': toNotionFields.title(uuid()),
          Date: {
            date: data.date,
          },
          Status: toNotionFields.status('Pending'),
          Customer: toNotionFields.relations([{ id: customerId }]),
          Event: toNotionFields.relations([{ id: data.eventId }]),
          ...(data.order ? {
            Order: toNotionFields.relations([{ id: data.order.id }]),
          } : {}),
        },
      };
      try {
        const response = await this.notionProvider.createPage(
          'DB_BOOKINGS',
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
}
