import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserMiddleware } from '../user/user.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
})
export class AuthorizationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
