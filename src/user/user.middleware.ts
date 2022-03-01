import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { RequestWithUser } from '../utils/request-with-user';

import { UserRepository } from './user.repository';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authorizationHeader = (req.headers.authorization ??= '');
    const match = authorizationHeader.match(/^Bearer (?<token>.+)/);

    if (authorizationHeader && !match) {
      throw new UnauthorizedException('invalid token');
    }

    if (match && match.groups?.token) {
      const { token } = match.groups;

      const user = await this.userRepository.findByToken(token);

      if (!user) {
        throw new UnauthorizedException('invalid token');
      }

      req.user = user;
    }

    next();
  }
}
