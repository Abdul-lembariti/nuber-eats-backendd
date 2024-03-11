import { InputType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { Order } from '../entities/order.enitity';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class GetOrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class GetOrderOutput extends MutationOutput {
  @Field((type) => Order, { nullable: true })
  order?: Order;
}
