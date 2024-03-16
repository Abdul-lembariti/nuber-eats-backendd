import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.enitity';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class TakeOrderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class TakeOrderOutput extends MutationOutput {}
