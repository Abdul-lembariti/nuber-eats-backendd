import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entitie/restaurants.enitites';
import { RestaurantService } from './restaurants.services';
import { Category } from './entitie/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantsResolver, RestaurantService],
})
export class RestaurantsModule {}
