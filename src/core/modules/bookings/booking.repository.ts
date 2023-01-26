/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { Service } from 'typedi';
import { uuid } from 'uuidv4';

import { toNotionFields } from '@/core/providers/notion/helpers/valueToField';
import { NotionProvider } from '@/core/providers/notion/notion.service';


@Service()
export class BookingRepository {
  private tijaConfig: any;
  constructor(
    private notionProvider: NotionProvider
  ) { }
  async getBookings(filters?: any, sort?: any): Promise<any> {
    return this.notionProvider.queryDatabase('DB_BOOKINGS', filters, sort);
  }

  async createCustomerFromBooking(data: any): Promise<any> {
    const customer = {
      parent: toNotionFields.parent('DB_CUSTOMERS'),
      properties: {
        'Full Name': toNotionFields.title([data.firstName, data.lastName].join(' ')),
        'First Name': toNotionFields.rich_text(data.firstName),
        'Last Name': toNotionFields.rich_text(data.lastName),
        'Email': toNotionFields.email(data.email),
        'Phone': toNotionFields.phone(data.phone),
      },
    };
    try {
      const response = await this.notionProvider.createPage('DB_CUSTOMERS', customer);
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
        parent: toNotionFields.parent(this.tijaConfig.DB_BOOKINGS),
        properties: {
          'Booking ID': toNotionFields.title(uuid()),
          Date: {
            date: {
              start: dayjs(data.startDate).format('YYYY-MM-DDTHH:mm:00.000+00:00'),
              end: dayjs(data.endDate).format('YYYY-MM-DDTHH:mm:00.000+00:00'),
              time_zone: data.timeZone,
            }
          },
          Status: toNotionFields.status('Pending'),
          Customer: toNotionFields.relations([
            { id: customerId, }
          ]),
          Event: toNotionFields.relations([
            { id: data.eventId, },
          ]),
        },
      };
      try {
        const response = await this.notionProvider.createPage('DB_BOOKINGS', booking);
        return response;
      } catch (err) {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}
