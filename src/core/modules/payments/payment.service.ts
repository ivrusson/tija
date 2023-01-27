/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { PaymentGatewayService } from '@/core/providers/payment-gateway/payment-gateway.service';

@Service()
export class PaymentService {
  constructor(private paymentGatewayService: PaymentGatewayService) { }

  async getPaymentLink(params: { bookingId: string; priceId: string; baseUrl: string; }): Promise<any> {
    return this.paymentGatewayService.getPaymentLink(params);
  }

  async getCheckout(sessionId: string): Promise<any> {
    return this.paymentGatewayService.getCheckout(sessionId);
  }

  async confirmOrder(sessionId: string): Promise<any> {
    return this.paymentGatewayService.getCheckout(sessionId);
  }
}
