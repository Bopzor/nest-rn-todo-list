import { ITodoDto } from 'todo-shared';

import { TodosPort } from '../todo/TodosPort';

export class InMemoryTodosAdapter implements TodosPort {
  todos: ITodoDto[] = [];

  async loadTodos(_token: string): Promise<ITodoDto[]> {
    return this.todos;
  }
}
