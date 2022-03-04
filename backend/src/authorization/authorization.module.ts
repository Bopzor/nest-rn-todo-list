import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserMiddleware } from 'src/user/middlewares/user.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
})
export class AuthorizationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
