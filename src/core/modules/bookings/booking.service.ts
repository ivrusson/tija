/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { OrderRepository } from '@/core/modules/orders/order.respository';

import { BookingRepository } from './booking.repository';

@Service()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository, private oderRepository: OrderRepository) { }

  async createBooking(data: any): Promise<any> {
    let order = null;
    if (data.product) {
      order = await this.oderRepository.createOrder(data);
    }
    const result = await this.bookingRepository.createBooking({ ...data, order });
    return result;
  }
  async getBooking(bookingId: string): Promise<any> {
    const result = await this.bookingRepository.getBooking(bookingId);
    return result;
  }


}
