/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Post } from 'next-api-decorators';
import Container from 'typedi';

import { CsrfToken } from '@/core/common/decorators/csrf.decorator';
import { BookingService } from '@/core/modules/bookings/booking.service';

export class BookingController {
  constructor(
    private bookingService: BookingService = Container.get(BookingService)
  ) {}

  @CsrfToken()
  @Post()
  public createBooking(@Body() body: any) {
    return this.bookingService.createBooking(body);
  }
}
