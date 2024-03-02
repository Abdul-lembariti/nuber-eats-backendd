import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Restaurant } from '../entitie/restaurants.enitites';
import { CreateRestaurantInputType } from './create-restaurants.dto';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class EditRestaurantInput extends PartialType(
  CreateRestaurantInputType,
) {}

@ObjectType()
export class EditRestaurantOutput extends MutationOutput {}
