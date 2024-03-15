import {
  Resolver,
  Mutation,
  Args,
  Query,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { AuthUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateOrderOutput, CreateOrderInput } from './dto/create-order.dto';
import { EditOrderOutput, EditOrderInput } from './dto/edit-order.dto';
import { GetOrdersOutput, GetOrdersInput } from './dto/get-order.dto';
import { GetOrderOutput, GetOrderInput } from './dto/get-orders.dto';
import { Order } from './entities/order.enitity';
import { OrderService } from './order.service';
import { Inject, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PUB_SUB } from '../common/common.const';
import { PubSub } from 'graphql-subscriptions';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation((returns) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.crateOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((returns) => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Mutation((returns) => Boolean)
  async potatoReady(@Args('potatoId') potatoId: number) {
    await this.pubSub.publish('hotPotatos', {
      readyPotato: potatoId,
    });
    return true;
  }

  @Subscription((returns) => String, {
    filter: ({ readyPotato }, { potatoId }) => {
      //cant get the context from connection
      return readyPotato === potatoId;
    },
    resolve: ({ readyPotato }) => `Your potato with id ${readyPotato} is ready`,
  })
  // @Role(['Any'])
  readyPotato(@Args('potatoId') potatoId: number) {
    return this.pubSub.asyncIterator('hotPotatos');
  }
}
