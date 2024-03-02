import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entitie/restaurants.enitites';
import { RestaurantService } from './restaurants.services';
import { CreateRestaurantInputType } from './dt0s/create-restaurants.dto';
import { CreateAccountOutput } from '../users/dt0s/create-account.dto';
import { AuthUser } from '../auth/auth-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { Role } from '../auth/role.decorator';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dt0s/edit-restaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateAccountOutput)
  @Role([UserRole.Owner])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInputType,
  ): Promise<CreateAccountOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Role([UserRole.Owner])
  editRestaurant(
    @AuthUser() authUser: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): EditRestaurantOutput {
    return {
      ok: true,
    };
  }
}
