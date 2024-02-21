import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDtos } from './create-restaurants.dto';

@InputType()
export class UpdateRestaurantInputType extends PartialType(
  CreateRestaurantDtos,
) {}

@InputType()
export class UpdateRestaurantsDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
