import { Args, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entitie/restaurants.enitites';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    console.log(veganOnly);
    return [];
  }
}
