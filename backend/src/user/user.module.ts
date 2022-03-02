import { FactoryProvider, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { InMemoryUserRepository } from '../tests/in-memory-user.repository';
import { UserOrmEntity } from './user-orm.entity';

import { UserTypeOrmRepository } from './user-typeorm.repository';
import { UserRepository } from './user.repository';

// TODO: find a more "nest way"
const inject = [];
const imports = [];

if (process.env.NODE_ENV !== 'test') {
  imports.push(TypeOrmModule.forFeature([UserOrmEntity]));
  inject.push(Connection);
}

const userRepositoryProvider: FactoryProvider<UserRepository> = {
  provide: UserRepository,
  inject,
  useFactory: (connection?: Connection) => {
    if (!connection) {
      return new InMemoryUserRepository();
    }

    return new UserTypeOrmRepository(connection);
  },
};

@Module({
  imports,
  providers: [userRepositoryProvider],
  exports: [userRepositoryProvider],
})
export class UserModule {}
