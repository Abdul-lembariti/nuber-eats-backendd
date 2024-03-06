import { Module } from '@nestjs/common';
import {
  CategoryResolver,
  DishResolver,
  RestaurantsResolver,
} from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entitie/restaurants.enitites';
import { RestaurantService } from './restaurants.services';
import { Category } from './entitie/category.entity';
import { CategoryRepository } from './repository/category.repository';
import { Dish } from './entitie/dish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Dish, Category, CategoryRepository]),
  ],
  providers: [
    RestaurantsResolver,
    RestaurantService,
    CategoryResolver,
    DishResolver,
  ],
})
export class RestaurantsModule {}
