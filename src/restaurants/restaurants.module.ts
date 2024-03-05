import { Module } from '@nestjs/common';
import { CategoryResolver, RestaurantsResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entitie/restaurants.enitites';
import { RestaurantService } from './restaurants.services';
import { Category } from './entitie/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Category, CategoryRepository]),
  ],
  providers: [RestaurantsResolver, RestaurantService, CategoryResolver],
})
export class RestaurantsModule {}
