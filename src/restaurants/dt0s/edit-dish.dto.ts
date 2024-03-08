import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Dish } from '../entitie/dish.entity';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class EditDishInput extends PartialType(
  PickType(Dish, ['name', 'price', 'description', 'options']),
) {
  @Field((type) => Int)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends MutationOutput {}
