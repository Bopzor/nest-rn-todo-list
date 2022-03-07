import { ICreateTodoDto, ITodoDto, IUpdateTodoDto } from 'todo-shared';

export interface TodosPort {
  loadTodos(token: string): Promise<ITodoDto[]>;
  createTodo(token: string, todo: ICreateTodoDto): Promise<ITodoDto>;
  updateTodo(token: string, params: { id: string; changes: IUpdateTodoDto }): Promise<ITodoDto>;
  toggleTodo(token: string, id: string): Promise<ITodoDto>;
  deleteTodo(token: string, id: string): Promise<string>;
}
