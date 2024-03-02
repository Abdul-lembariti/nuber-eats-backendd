import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Allowed } from './role.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflactor: Reflector) {}
  canActivate(context: ExecutionContext) {
    const role = this.reflactor.get<Allowed>('roles', context.getHandler());
    if (!role) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];
    if (!user) {
      return false;
    }
    if (role.includes('Any' as UserRole)) {
      return true;
    }
    return role.includes(user.role);
  }
}
