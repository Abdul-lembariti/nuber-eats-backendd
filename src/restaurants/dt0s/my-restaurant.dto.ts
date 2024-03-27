import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/output.dto';
import { Restaurant } from '../entitie/restaurants.enitites';

@InputType()
export class MyRestaurantInput extends PickType(Restaurant, ['id']) {}

@ObjectType()
export class MyRestaurantOutput extends MutationOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
