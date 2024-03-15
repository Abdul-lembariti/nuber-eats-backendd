import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Restaurant } from './entitie/restaurants.enitites';
import { RestaurantService } from './restaurants.services';
import { CreateAccountOutput } from '../users/dt0s/create-account.dto';
import { AuthUser } from '../auth/auth-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { Role } from '../auth/role.decorator';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dt0s/edit-restaurant.dto';
import { CreateRestaurantInput } from './dt0s/create-restaurants.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dt0s/delete-restaurant.dtos';
import { Category } from './entitie/category.entity';
import { AllCategoriesOuput } from './dt0s/allCategories.dto';
import { CategoryInput, CategoryOutput } from './dt0s/category.dto';
import { RestaurantsInput, RestaurantsOutput } from './dt0s/restaurant.dtos';
import { RestaurantInput, RestaurantOutput } from './dt0s/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dt0s/search-restaurant.dto';
import { Dish } from './entitie/dish.entity';
import { CreateDishInput, CreateDishOutput } from './dt0s/createDish.dto';
import { EditDishInput, EditDishOutput } from './dt0s/edit-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dt0s/delete-dish.dto';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateAccountOutput)
  @Role([UserRole.Owner])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
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
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(authUser, editRestaurantInput);
  }

  @Mutation((returns) => DeleteRestaurantOutput)
  @Role([UserRole.Owner])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }

  @Query((returns) => RestaurantsOutput)
  restaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }

  @Query((returns) => RestaurantOutput)
  restaurant(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput);
  }

  @Query((returns) => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
}

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField((type) => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    console.log(category);
    return this.restaurantService.countRestaurants(category);
  }

  @Query((type) => AllCategoriesOuput)
  allCategories(): Promise<AllCategoriesOuput> {
    return this.restaurantService.allCategories();
  }

  @Query((type) => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.categoryBySlug(categoryInput);
  }
}

@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((type) => CreateDishOutput)
  @Role([UserRole.Owner])
  async createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(owner, createDishInput);
  }

  @Mutation((type) => EditDishOutput)
  @Role([UserRole.Owner])
  async editDish(
    @AuthUser() owner: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.restaurantService.editDish(owner, editDishInput);
  }

  @Mutation((type) => DeleteDishOutput)
  @Role([UserRole.Owner])
  async deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDish(owner, deleteDishInput);
  }
}
