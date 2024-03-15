import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    if (!token) {
      throw new UnauthorizedException('Token not found in context');
    }

    try {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);
        if (!user) {
          return false;
        }
        gqlContext['user'] = user;
        if (roles.includes('Any')) {
          return true;
        }
        return roles.includes(user.role);
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error occurred:', error);
      return false;
    }
  }
}
