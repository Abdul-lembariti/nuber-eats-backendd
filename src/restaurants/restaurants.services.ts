import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CategoryRepository } from './repository/category.repository';
import { Restaurant } from './entitie/restaurants.enitites';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dt0s/create-restaurants.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dt0s/edit-restaurant.dto';
import { Category } from './entitie/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    private readonly category: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      console.log(newRestaurant);

      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOneBy({ slug: categorySlug });
      if (!category) {
        category = await this.categories.save(
          this.categories.create({ slug: categorySlug, name: categoryName }),
        );
      }
      console.log(category || 'category not found');

      if (!category) {
        throw new Error('Could not get or create category');
      }

      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message || 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: editRestaurantInput.restaurantId },
        relations: ['category'], // Load the associated category
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }

      // Update restaurant name
      restaurant.name = editRestaurantInput.name;

      // Update category if categoryName provided
      if (editRestaurantInput.categoryName) {
        let category = await this.categories.findOne({
          where: { name: editRestaurantInput.categoryName },
        });
        if (!category) {
          // If category doesn't exist, create a new one
          const slug = this.generateSlug(editRestaurantInput.categoryName);
          category = await this.categories.save(
            this.categories.create({
              name: editRestaurantInput.categoryName,
              slug: slug,
            }),
          );
        }
        restaurant.category = category;
      }

      // Save changes to restaurant
      await this.restaurants.save(restaurant);

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message || 'Could not edit Restaurant',
      };
    }
  }

  private generateSlug(name: string): string {
    // Implement your slug generation logic here
    // For example, you can remove special characters and replace spaces with hyphens
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }
}
