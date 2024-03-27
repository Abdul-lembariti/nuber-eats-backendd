import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { LessThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePaymentInput } from './dto/create-payment.dto';
import { CreateAccountOutput } from '../users/dt0s/create-account.dto';
import { Restaurant } from '../restaurants/entitie/restaurants.enitites';
import { GetPaymentOutput } from './dto/getpayment.dto';
import { Cron, Interval } from '@nestjs/schedule';

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
    try {
      const restaurant = await this.restaurant.findOne({
        where: { id: restaurantId },
        relations: ['owner'], // Include 'owner' relation to avoid additional queries
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Couldnt find the restaurant',
        };
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'not allowed to continue',
        };
      }

      // Ensure the restaurant's name is provided
      if (!restaurant.name) {
        return {
          ok: false,
          error: 'Restaurant name is required',
        };
      }
      // restaurant promotion
      restaurant.isPromoted = true;
      const date = new Date();
      date.setDate(date.getDate() + 7);
      restaurant.promotedUntil = date;
      this.restaurant.save(restaurant);
      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        ok: false,
        error: 'Couldnt proceed with payment',
      };
    }
  }

  async getPayments(user: User): Promise<GetPaymentOutput> {
    try {
      const payments = await this.payments.find({
        where: { user: { id: user.id } },
      });
      return {
        ok: true,
        payments,
      };
    } catch (e) {
      console.log(e.message);
      return {
        ok: false,
        error: 'Couldnt proceed with payment',
      };
    }
  }

  @Interval(2000)
  async checkPromotedRestaurants() {
    const restaurant = await this.restaurant.find({
      where: { isPromoted: true, promotedUntil: LessThan(new Date()) },
    });
    console.log(restaurant);
    restaurant.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurant.save(restaurant);
    });
  }
}

//scheduling tasks
/*  @Cron('30 * * * * *', {
    name: 'myJob',
  })
  checkForPayments() {
    console.log('Checking for payments....(cron)');
    const job = this.scheduleRegistry.getCronJob('myJob');
    job.stop();
  }
  @Interval(5000)
  checkForPaymentsI() {
    console.log('Checking for payments....(Interval)');
  }

  @Timeout(20000)
  afterStarts() {
    console.log('congrats');
  } */
