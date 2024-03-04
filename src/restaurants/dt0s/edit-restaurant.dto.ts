import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/output.dto';
import { CreateRestaurantInput } from './create-restaurants.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends MutationOutput {}
