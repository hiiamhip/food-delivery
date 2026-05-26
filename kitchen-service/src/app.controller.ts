import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order_created')
  async handleOrderCreated(data: {
    orderId: string;
    customerName: string;
    item: string;
    quantity: number;
  }) {
    console.log('Kitchen received order: ' + data.orderId);

    await this.appService.processOrder(data);
  }
}
