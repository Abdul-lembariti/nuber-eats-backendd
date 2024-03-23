import { Field, ObjectType } from '@nestjs/graphql';
import { Restaurant } from '../entitie/restaurants.enitites';
import { MutationOutput } from '../../common/dtos/output.dto';

@ObjectType()
export class MyRestaurantsOutput extends MutationOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}
