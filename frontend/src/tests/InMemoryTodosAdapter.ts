import { ICreateTodoDto, ITodoDto } from 'todo-shared';

import { TodosPort } from '../todo/TodosPort';

export class InMemoryTodosAdapter implements TodosPort {
  todos: ITodoDto[] = [];

  async loadTodos(_token: string): Promise<ITodoDto[]> {
    return this.todos;
  }

  async createTodo(_token: string, todo: ICreateTodoDto): Promise<ITodoDto> {
    const createdTodo = { ...todo, id: 'todo-1' };

    this.todos.push(createdTodo);

    return createdTodo;
  }
}
