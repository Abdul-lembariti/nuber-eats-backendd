import { Injectable } from '@nestjs/common';
import { Restaurant } from './entitie/restaurants.enitites';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDtos } from './dt0s/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dt0s/update-restaurants.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}
  getAll(): Promise<Restaurant[]> {
    return this.restaurant.find();
  }
  createRestaurant(
    createRestaurantDto: CreateRestaurantDtos,
  ): Promise<Restaurant> {
    const newRestaurant = this.restaurant.create(createRestaurantDto);
    return this.restaurant.save(newRestaurant);
  }
  updateRestaurant({ id, data }: UpdateRestaurantsDto) {
    return this.restaurant.update(id, { ...data });
  }
}
