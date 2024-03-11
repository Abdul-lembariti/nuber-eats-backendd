import { InputType, PickType, ObjectType } from '@nestjs/graphql';
import { Order } from '../entities/order.enitity';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class EditOrderInput extends PickType(Order, ['id', 'status']) {}

@ObjectType()
export class EditOrderOutput extends MutationOutput {}
