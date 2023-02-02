/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Post, Request } from 'next-api-decorators';

import { tijaService } from '@/core';
import urlFromRequest from '@/core/common/utils/url-from-request';
import { PaymentService } from '@/core/modules/payments/payment.service';
import type { NextTijaRequest } from '@/core/types';


export class PaymentController {
  constructor(
    private paymentService: PaymentService = tijaService('payments')
  ) { }

  @Post('/payment-link')
  public getPaymentLink(@Request() req: NextTijaRequest, @Body() body: any) {
    const { bookingId, priceId } = body;
    const baseUrl = urlFromRequest(req);

    return this.paymentService.getPaymentLink({ bookingId, priceId, baseUrl });
  }

  @Post('/checkout')
  public getCheckout(@Body() body: any) {
    const { sessionId } = body;

    return this.paymentService.getCheckout(sessionId);
  }
}
