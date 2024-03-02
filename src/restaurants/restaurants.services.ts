import { Injectable } from '@nestjs/common';
import { Restaurant } from './entitie/restaurants.enitites';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantInputType } from './dt0s/create-restaurants.dto';
import { CreateAccountOutput } from '../users/dt0s/create-account.dto';
import { User } from '../users/entities/user.entity';
import { Category } from './entitie/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInputType,
  ): Promise<CreateAccountOutput> {
    try {
      const newRestaurant = this.restaurant.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.category.findOneBy({ slug: categorySlug });
      if (!category) {
        category = await this.category.save(
          this.category.create({ slug: categorySlug, name: categoryName }),
        );
      }
      newRestaurant.category = category;
      await this.restaurant.save(newRestaurant);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }
}
