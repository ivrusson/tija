/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { UpdateBookingDto } from '@/core/modules/bookings/dto/UpdateBooking.dto';
import { OrderRepository } from '@/core/modules/orders/order.respository';
import { PipeDreamService } from '@/core/services/pipedream/pipedream.service';

import { BookingRepository } from './booking.repository';

@Service()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository, private oderRepository: OrderRepository, private pipeDreamService: PipeDreamService) { }

  async createBooking(data: any, baseUrl: string): Promise<any> {
    let order = null;
    if (data.product) {
      order = await this.oderRepository.createOrder(data);
    }
    const result = await this.bookingRepository.createBooking({ ...data, order });
    const url = baseUrl + "/bookings/" + result.id

    if (result) {
      this.pipeDreamService.run('Bookings:after-create', { ...result, url });
    }

    return result;
  }

  async getBooking(bookingId: string): Promise<any> {
    const result = await this.bookingRepository.getBooking(bookingId);
    return result;
  }

  async updateBooking(bookingId: string, data: UpdateBookingDto, baseUrl: string): Promise<any> {
    const result = await this.bookingRepository.updateBooking(bookingId, data);

    if (result) {
      const url = baseUrl + "/bookings/" + result.id;
      this.pipeDreamService.run('Bookings:after-update', { ...result, url });

      return { ...result, url };
    }
    return result;
  }

}
