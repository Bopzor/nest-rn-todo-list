import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.username === username);
  }

  async findByToken(token: string): Promise<User | undefined> {
    return this.users.find((u) => u.token === token);
  }
}
