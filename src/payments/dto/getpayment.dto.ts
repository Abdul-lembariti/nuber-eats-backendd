import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/output.dto';
import { Payment } from '../entities/payment.entity';

@ObjectType()
export class GetPaymentOutput extends MutationOutput {
  @Field((type) => [Payment], { nullable: true })
  payments?: Payment[];
}
