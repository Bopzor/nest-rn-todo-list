import { User } from '../entities/User';
import { UserRepository } from '../user/user.repository';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
