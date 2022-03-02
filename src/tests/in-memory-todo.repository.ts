import { Todo } from '../entities/Todo';
import { TodoRepository } from '../todo/todo.repository';

export class InMemoryTodoRepository implements TodoRepository {
  todos: Todo[] = [];

  async findAllForUser(userId: string): Promise<Todo[]> {
    return this.todos.filter((t) => t.user_id === userId);
  }

  async findById(todoId: string): Promise<Todo | undefined> {
    return this.todos.find((t) => t.id === todoId);
  }

  async saveTodo(todo: Todo): Promise<void> {
    const todoIdx = this.todos.findIndex((t) => t.id === todo.id);

    if (todoIdx < 0) {
      this.todos.push(todo);
      return;
    }

    // prettier-ignore
    this.todos = [
      ...this.todos.slice(0, todoIdx),
      todo,
      ...this.todos.slice(todoIdx + 1)
    ]
  }

  async deleteTodo(todoId: string): Promise<void> {
    const todoIdx = this.todos.findIndex((t) => t.id === todoId);

    if (todoIdx < 0) {
      return;
    }

    // prettier-ignore
    this.todos = [
      ...this.todos.slice(0, todoIdx),
      ...this.todos.slice(todoIdx + 1)
    ]
  }
}
