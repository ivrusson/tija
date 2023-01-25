/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { BookingRepository } from './booking.repository';

@Service()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async createBooking(data: any): Promise<any> {
    const result = await this.bookingRepository.createBooking(data);
    return result;
  }
}
