import { ICreateTodoDto, ITodoDto, IUpdateTodoDto } from 'todo-shared';

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

  async updateTodo(_token: string, params: { id: string; changes: IUpdateTodoDto }): Promise<ITodoDto> {
    const todoIdx = this.todos.findIndex((t) => t.id === params.id);
    const updatedTodo = { ...this.todos[todoIdx], ...params.changes };

    // prettier-ignore
    this.todos = [
      ...this.todos.slice(0, todoIdx),
      updatedTodo,
      ...this.todos.slice(todoIdx + 1)
    ]

    return updatedTodo;
  }
}
