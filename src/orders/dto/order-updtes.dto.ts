import { InputType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.enitity';

@InputType()
export class OrderUpdateInput extends PickType(Order, ['id']) {}
