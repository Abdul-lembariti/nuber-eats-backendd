import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Order } from './entities/order.enitity';
import { OrderService } from './order.service';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation((returns) => CreateOrderOutput)
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.orderService.creaetOrder(customer, createOrderInput);
  }
}
