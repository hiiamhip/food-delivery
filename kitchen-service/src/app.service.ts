import { Inject, Injectable } from '@nestjs/common';
import { db } from './db/db';
import { ClientProxy } from '@nestjs/microservices';
import { tickets } from './db/schema';

@Injectable()
export class AppService {
  constructor(
    @Inject('RIDER_SERVICE') private readonly riderClient: ClientProxy,
  ) {}

  async processOrder(data: {
    orderId: string;
    customerName: string;
    item: string;
    quantity: number;
  }) {
    const [ticket] = await db
      .insert(tickets)
      .values({
        orderId: data.orderId,
        customerName: data.customerName,
        item: data.item,
        status: 'received',
      })
      .returning();

    console.log('Ticket saved to kitchen DB. ID ' + ticket.id);

    this.riderClient.emit('order_ready', {
      orderId: data.orderId,
      customerName: data.customerName,
      item: data.item,
    });

    console.log('Event Emitted to the rider_queue (Order ready for pickup)');
  }
}
