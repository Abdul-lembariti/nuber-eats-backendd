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
import {
  NEW_COOKED_ORDER,
  NEW_PENDING_ORDER,
  NEW_UPDATE_ORDER,
  PUB_SUB,
} from '../common/common.const';
import { PubSub } from 'graphql-subscriptions';
import { OrderUpdateInput } from './dto/order-updtes.dto';
import { TakeOrderInput, TakeOrderOutput } from './dto/take-order.dto';

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

  @Subscription((returns) => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
      //cant get the context with details of the owner
      console.log('user:', user);
      console.log('ownerId:', ownerId);

      //should asing the ownerId by using context(USerId)

      return ownerId === 5;
    },
    resolve: ({ pendingOrders: { order } }) => order,
  })
  // @Role(['Owner'])    //CANT RUN BY USING TOKEN DUE TO CANT GET TOKEN KEEPS OM RUNING
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  @Subscription((returns) => Order)
  // @Role(['Delivery'])
  coockedOrder() {
    return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
  }

  @Subscription((returns) => Order, {
    filter: (
      { orderUpdates: order }: { orderUpdates: Order },
      { input }: { input: OrderUpdateInput },
      { user }: { user: User },
    ) => {
      //assing the constant values so as to be able to test the defensive

      if (
        order.driverId !== 7 &&
        order.customerId !== 6 &&
        order.restaurant.ownerId !== 5
      ) {
        return true;
      } // cant perform defensive programming due to cant get the token

      return order.id === input.id;
    },
  })
  // @Role({'Any'})
  orderUpdates(@Args('input') orderUpdateInput: OrderUpdateInput) {
    return this.pubSub.asyncIterator(NEW_UPDATE_ORDER);
  }

  @Mutation((returns) => TakeOrderOutput)
  @Role(['Delivery'])
  takeOrder(
    @AuthUser() driver: User,
    @Args('input') takeOrderInput: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    return this.ordersService.takeOrder(driver, takeOrderInput);
  }
}

/**/
