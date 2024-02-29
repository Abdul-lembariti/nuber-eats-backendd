import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userServie: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decode = this.jwtService.verify(token.toString());
      if (typeof decode === 'object' && decode.hasOwnProperty('id')) {
        try {
          const { user, ok } = await this.userServie.findById(decode['id']);
          if (ok) {
            req['user'] = user;
          }
        } catch (e) {}
      }
    }
    next();
  }
}
