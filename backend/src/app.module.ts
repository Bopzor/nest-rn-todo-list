import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from 'authorization/authorization.module';

import { AppController } from './app.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { TodoModule } from './todo/todo.module';
import { TypeOrmConfigService } from './typeorm/typeormconfig.service';

@Module({
  imports: [
    AuthorizationModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthenticationModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
