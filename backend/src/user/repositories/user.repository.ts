import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByUsername(username: string): Promise<undefined | User>;
  abstract findByToken(token: string): Promise<undefined | User>;
}
