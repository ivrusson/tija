/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Header, Post, Request } from 'next-api-decorators';

import { tijaService } from '@/core';
import { PaymentService } from '@/core/modules/payments/payment.service';


export class PaymentController {
  constructor(
    private paymentService: PaymentService = tijaService('payments')
  ) { }

  @Post('/payment-link')
  public getPaymentLink(@Request() req: any, @Header('host') host: string, @Body() body: any) {
    const { bookingId, priceId } = body;
    const protocol =
      req.headers["x-forwarded-proto"] || req.connection.encrypted
        ? "https"
        : "http";
    const baseUrl = `${protocol}://${host}`;

    return this.paymentService.getPaymentLink({ bookingId, priceId, baseUrl });
  }

  @Post('/checkout')
  public getCheckout(@Body() body: any) {
    const { sessionId } = body;

    return this.paymentService.getCheckout(sessionId);
  }
}
