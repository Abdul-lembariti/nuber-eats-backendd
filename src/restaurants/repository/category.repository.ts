import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entitie/category.entity";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getOrCreate(name: string): Promise<Category> {
    try {
      const categoryName = name.trim().toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');

      let category = await this.findOne({ where: { slug: categorySlug } });

      if (!category) {
        category = this.create({ slug: categorySlug, name: categoryName });
        await this.save(category);
      }

      return category;
    } catch (error) {
      console.error('Error in getOrCreate:', error);
      throw error; 
    }
  }
}
