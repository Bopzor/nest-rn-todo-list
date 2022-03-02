import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

import { User } from '../entities/User';
import { UserOrmEntity } from './user-orm.entity';

import { UserRepository } from './user.repository';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  private readonly repository: Repository<UserOrmEntity>;

  constructor(private readonly connection: Connection) {
    this.repository = connection.getRepository(UserOrmEntity);
  }

  async save(user: User): Promise<void> {
    await this.repository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const userOrm = await this.repository.findOne({ where: { username: username } });

    if (!userOrm) {
      return;
    }

    return new User({
      ...userOrm,
      token: userOrm.token ?? undefined,
    });
  }

  async findByToken(token: string): Promise<User | undefined> {
    const userOrm = await this.repository.findOne({ where: { token: token } });

    if (!userOrm) {
      return;
    }

    return new User({
      ...userOrm,
      token: userOrm.token ?? undefined,
    });
  }
}
