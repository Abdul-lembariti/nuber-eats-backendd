import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePaymentInput } from './dto/create-payment.dto';
import { CreateAccountOutput } from '../users/dt0s/create-account.dto';
import { Restaurant } from '../restaurants/entitie/restaurants.enitites';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreateAccountOutput> {
    const restaurant = await this.restaurant.findOne({
      where: { id: restaurantId },
    });
  }
}
