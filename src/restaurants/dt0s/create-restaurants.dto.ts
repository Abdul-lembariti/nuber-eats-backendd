import {
  ArgsType,
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { Restaurant } from '../entitie/restaurants.enitites';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'address',
  'coverImg',
]) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends MutationOutput {
  @Field((type) => Int)
  restaurantId?: number;
}
