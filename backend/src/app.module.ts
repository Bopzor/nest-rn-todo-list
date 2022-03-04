import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TodoModule } from './todo/todo.module';
import { TypeOrmConfigService } from './typeorm/typeormconfig.service';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    GraphqlModule,
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
