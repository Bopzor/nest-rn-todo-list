import { Todo } from '../entities/Todo';

export abstract class TodoRepository {
  abstract findAllForUser(userId: string): Promise<Todo[]>;
  abstract findById(todoId: string): Promise<Todo | undefined>;
  abstract saveTodo(todo: Todo): Promise<void>;
}
