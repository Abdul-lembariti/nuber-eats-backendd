import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { ILike, Like, Repository } from 'typeorm';
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
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dt0s/delete-restaurant.dtos';
import { AllCategoriesOuput } from './dt0s/allCategories.dto';
import { error } from 'console';
import { CategoryInput, CategoryOutput } from './dt0s/category.dto';
import { RestaurantsInput, RestaurantsOutput } from './dt0s/restaurant.dtos';
import { RestaurantInput, RestaurantOutput } from './dt0s/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dt0s/search-restaurant.dto';
import { CreateDishInput, CreateDishOutput } from './dt0s/createDish.dto';
import { Dish } from './entitie/dish.entity';
import { EditDishInput, EditDishOutput } from './dt0s/edit-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dt0s/delete-dish.dto';
import { MyRestaurantsOutput } from './dt0s/myRestaurants.dto';
import {
  MyRestaurantInput,
  MyRestaurantOutput,
} from './dt0s/my-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dish: Repository<Dish>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
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
        restaurantId: newRestaurant.id,
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
        relations: ['category'],
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

      restaurant.name = editRestaurantInput.name;

      if (editRestaurantInput.categoryName) {
        let category = await this.categories.findOne({
          where: { name: editRestaurantInput.categoryName },
        });
        if (!category) {
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
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: restaurantId },
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
          error: "You can't delete a restaurant that you don't own",
        };
      }
      // console.log('will delete', restaurant);
      await this.restaurants.delete(restaurantId);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: "Couldn't delete a restaurant",
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOuput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: "Couldn't get all categories",
      };
    }
  }

  countRestaurants(category: Category) {
    return this.restaurants.count({ where: { category: { id: category.id } } });
  }

  async categoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ where: { slug } });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const restaurants = await this.restaurants.find({
        where: {
          category: category,
        },
        order: {
          isPromoted: 'DESC',
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      const totalResults = await this.countRestaurants(category);
      return {
        ok: true,
        restaurants: restaurants,
        category,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      if (page < 1) {
        page = 1;
      }

      const take = 3;
      const skip = (page - 1) * take;

      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        skip,
        take,
        order: {
          isPromoted: 'DESC',
        },
      });

      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (error) {
      console.error('Error loading restaurants:', error);
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: restaurantId },
        relations: ['menu'],
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Could not find restaurant',
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: {
          name: Like(`%${query}%`),
        },
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }

  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: createDishInput.restaurantId },
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
          error:
            "You can't create a dish for this restaurant because you are not the owner.",
        };
      }
      await this.dish.save(
        this.dish.create({ ...createDishInput, restaurant }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Could not create dish',
      };
    }
  }

  async editDish(
    owner: User,
    editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    try {
      // Load the dish entity along with its restaurant relation
      const dish = await this.dish.findOne({
        where: { id: editDishInput.dishId },
        relations: ['restaurant'],
      });

      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }

      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You cant continue editing the dish as you aint the owner',
        };
      }

      // Update dish properties
      if (editDishInput.name) {
        dish.name = editDishInput.name;
      }
      if (editDishInput.price) {
        dish.price = editDishInput.price;
      }
      if (editDishInput.description) {
        dish.description = editDishInput.description;
      }
      if (editDishInput.options) {
        dish.options = editDishInput.options;
      }

      // Save the updated dish
      await this.dish.save(dish);

      return {
        ok: true,
      };
    } catch (error) {
      console.log('Couldnt edit the dish:', error);
      return {
        ok: false,
        error: 'Couldnt edit the dish',
      };
    }
  }

  async deleteDish(
    owner: User,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dish.findOne({
        where: { id: dishId },
        relations: ['restaurant'],
      });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }
      if (dish.restaurant.id !== owner.id) {
        return {
          ok: false,
          error: 'You need to be the owner of restaurant to delete',
        };
      }
      await this.dish.delete(dishId);
      return {
        ok: true,
      };
    } catch (error) {
      console.log('You cant proceed deleting :', error);
      return {
        ok: false,
        error: 'Could not delete',
      };
    }
  }

  async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
    try {
      const ownerId = owner.id;
      console.log('User', ownerId);

      const restaurants = await this.restaurants.find({
        where: { owner: { id: ownerId } },
      });

      if (restaurants.length === 0) {
        return {
          restaurants: [], // Return an empty array if no restaurants found
          ok: true,
          error: 'Could not findRestaurants',
        };
      }
      return {
        restaurants,
        ok: true,
      };
    } catch (error) {
      console.error('Error fetching restaurants:', error.message);
      return {
        ok: false,
        error: 'Could not find restaurants.',
      };
    }
  }

  async myRestaurant(
    owner: User,
    { id }: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { owner: { id: owner.id }, id },
        relations: ['menu', 'orders'],
      });
      return {
        restaurant,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }
}
