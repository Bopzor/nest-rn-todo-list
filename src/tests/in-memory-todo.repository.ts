import { Todo } from '../entities/Todo';
import { TodoRepository } from '../todo/todo.repository';

export class InMemoryTodoRepository implements TodoRepository {
  todos: Todo[] = [];

  async findAllForUser(userId: string): Promise<Todo[]> {
    return this.todos.filter((t) => t.user_id === userId);
  }
}
