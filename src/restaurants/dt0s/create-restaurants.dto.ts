import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { Restaurant } from '../entitie/restaurants.enitites';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreateRestaurantInputType extends PickType(Restaurant, [
  'name',
  'address',
  'coverImg',
]) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutputType extends MutationOutput {}
