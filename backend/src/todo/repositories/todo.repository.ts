import { Todo } from '../entities/todo.entity';

export abstract class TodoRepository {
  abstract findAllForUser(userId: string): Promise<Todo[]>;
  abstract findById(todoId: string): Promise<Todo | undefined>;
  abstract saveTodo(todo: Todo): Promise<void>;
  abstract deleteTodo(todoId: string): Promise<void>;
}
