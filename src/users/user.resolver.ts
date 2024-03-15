import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dt0s/create-account.dto';
import { LoginInput, LoginOutput } from './dt0s/login.dto';
import { UserProfileInput, UserProfileOutput } from './dt0s/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dt0s/edit-profile.dto';
import { VerifyEmailInPut, VerifyEmailOutPut } from './dt0s/verify-email.dto';
import { Role } from '../auth/role.decorator';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((returns) => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Role(['Any'])
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Role(['Any'])
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((returns) => VerifyEmailOutPut)
  verifyEmail(
    @Args('input') { code }: VerifyEmailInPut,
  ): Promise<VerifyEmailOutPut> {
    return this.usersService.verifyEmail(code);
  }
}
