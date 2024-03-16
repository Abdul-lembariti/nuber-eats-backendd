import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Payment } from '../entities/payment.entity';
import { MutationOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreatePaymentInput extends PickType(Payment, [
  'transactionId',
  'restaurantId',
]) {}

@ObjectType()
export class CreatePaymentOutput extends MutationOutput {}
