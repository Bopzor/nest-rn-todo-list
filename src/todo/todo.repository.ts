import { Todo } from '../entities/Todo';
import { User } from '../entities/User';

export abstract class TodoRepository {
  abstract findAllForUser(userId: string): Promise<Todo[]>;
}
