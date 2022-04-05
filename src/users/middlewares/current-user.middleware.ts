import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

// The Auth guard isn't working because it depends on an user being attached to the request by the current-user interceptor
// The execution order in NestJS is -> middlewares, guards, interceptors (right before or right after the request handler)
// So we need the interceptor to become a middleware for it to execute before the auth guard

// Must be Injectable because we need to use DI
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }
    next();
  }
}
