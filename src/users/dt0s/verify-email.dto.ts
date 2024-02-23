import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Verification } from '../entities/verfication.entity';

@ObjectType()
export class VerifyEmailOutPut extends MutationOutput {}

@InputType()
export class VerifyEmailInPut extends PickType(Verification, ['code']) {}
