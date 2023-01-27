/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from 'typedi';

import { OrderRepository } from './order.respository';

@Service()
export class OrderService {
  constructor(private orderRepository: OrderRepository) { }

  // eslint-disable-next-line unused-imports/no-unused-vars
  async updateOrder(orderId: string, data: any): Promise<any> {
    return this.orderRepository.updateOrder(orderId, data);
  }
}
