import { NotFoundException } from 'next-api-decorators';
import { Stripe } from 'stripe';
import { Service } from 'typedi';

import { ConfigService } from '@/core/config/config.service';

@Service()
export class PaymentGatewayService {
  private client;
  constructor(private configService: ConfigService) {
    this.client = new Stripe(configService.get('PAYMENT_GATEWAY_TOKEN'), {
      apiVersion: "2022-11-15",
    });
  }

  public async getPaymentLink({ bookingId, priceId, baseUrl }: { bookingId: string; priceId: string; baseUrl: string; }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    try {
      const session = await this.client.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        invoice_creation: {
          enabled: true,
        },
        success_url: `${baseUrl}/payments/complete/${bookingId}/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/payments/cancelled/${bookingId}`,
        mode: 'payment',
      });
      return { url: `${session.url}` }
    } catch (err) {
      throw new NotFoundException('Error generating payment link');
    }
  }

  public async getCheckout(sessionId: string) {
    try {
      const session = await this.client.checkout.sessions.retrieve(sessionId);
      if (session) {
        const invoiceId = session.invoice as string;
        const invoice = await this.client.invoices.retrieve(invoiceId);
        return {
          session,
          invoice,
        }
      }
      return { session };
    } catch (err) {
      throw new NotFoundException('Session not found');
    }
  }
}