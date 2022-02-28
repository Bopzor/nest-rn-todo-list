import { ClassProvider, Module } from '@nestjs/common';

import { InMemoryUserRepository } from '../tests/in-memory-user.repository';

import { UserRepository } from './user.repository';

const userRepositoryProvider: ClassProvider<UserRepository> = {
  provide: UserRepository,
  useClass: InMemoryUserRepository,
};

@Module({
  imports: [],
  providers: [userRepositoryProvider],
  exports: [userRepositoryProvider],
})
export class UserModule {}
