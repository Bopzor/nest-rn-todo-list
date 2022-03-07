import { ITodoDto } from 'todo-shared';

export interface TodosPort {
  loadTodos(token: string): Promise<ITodoDto[]>;
}
