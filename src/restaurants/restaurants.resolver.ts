import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entitie/restaurants.enitites';
import { CreateRestaurantDtos } from './dt0s/create-restaurants.dto';
import { RestaurantService } from './restaurants.services';
import { boolean } from 'joi';
import { UpdateRestaurantsDto } from './dt0s/update-restaurants.dto';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }
  @Mutation((returns) => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDtos,
  ): Promise<Boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation((returns) => Boolean)
  async updateRestaurant(
    @Args('input') UpdateRestaurantsDto: UpdateRestaurantsDto,
  ): Promise<Boolean> {
    try {
      await this.restaurantService.updateRestaurant(UpdateRestaurantsDto);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}