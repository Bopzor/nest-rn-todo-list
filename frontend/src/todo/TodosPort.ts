import { ICreateTodoDto, ITodoDto } from 'todo-shared';

export interface TodosPort {
  loadTodos(token: string): Promise<ITodoDto[]>;
  createTodo(token: string, todo: ICreateTodoDto): Promise<ITodoDto>;
}
