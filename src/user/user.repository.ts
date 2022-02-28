import { User } from '../entities/User';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByUsername(username: string): Promise<undefined | User>;
}
