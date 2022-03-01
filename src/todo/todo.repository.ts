import { Todo } from '../entities/Todo';

export abstract class TodoRepository {
  abstract findAllForUser(userId: string): Promise<Todo[]>;
  abstract saveTodo(todo: Todo): Promise<void>;
}
