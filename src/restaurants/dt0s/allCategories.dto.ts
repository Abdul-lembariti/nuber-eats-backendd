import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/output.dto';
import { Category } from '../entitie/category.entity';

@ObjectType()
export class AllCategoriesOuput extends MutationOutput {
  @Field((type) => [Category], { nullable: true })
  categories?: Category[];
}
