/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Param, Post, Request } from 'next-api-decorators';
import Container from 'typedi';

import { CsrfToken } from '@/core/common/decorators/csrf.decorator';
import urlFromRequest from '@/core/common/utils/url-from-request';
import { BookingService } from '@/core/modules/bookings/booking.service';
import type { NextTijaRequest } from '@/core/types';


export class BookingController {
  constructor(
    private bookingService: BookingService = Container.get(BookingService)
  ) { }

  @CsrfToken()
  @Post()
  public createBooking(@Request() req: NextTijaRequest, @Body() body: any) {
    const baseUrl = urlFromRequest(req);
    return this.bookingService.createBooking({ ...body }, baseUrl);
  }

  @Post('/:bookingId/cancelled')
  public updateBooking(@Request() req: NextTijaRequest, @Param('bookingId') bookingId: string) {
    const baseUrl = urlFromRequest(req);
    return this.bookingService.updateBooking(bookingId, { Status: { status: { name: 'Cancelled' } } }, baseUrl);
  }

  // @Patch('/:bookingId')
  // public updateBooking(@Request() req: NextTijaRequest, @Param('bookingId') bookingId: string, @Body() body: UpdateBookingDto) {
  //   const baseUrl = urlFromRequest(req);
  //   return this.bookingService.updateBooking(bookingId, body, baseUrl);
  // }
}
