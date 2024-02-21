import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entitie/restaurants.enitites';

@InputType()
export class CreateRestaurantDtos extends OmitType(
  Restaurant,
  ['id'],
) {}
