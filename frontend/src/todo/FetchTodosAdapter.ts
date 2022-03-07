import Constants from 'expo-constants';

import { ICreateTodoDto, ITodoDto } from 'todo-shared';

import { TodosPort } from './TodosPort';

export class FetchTodosAdapter implements TodosPort {
  async loadTodos(token: string): Promise<ITodoDto[]> {
    try {
      const result = await fetch(Constants?.manifest?.extra?.API_URL + '/todos', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return await result.json();
    } catch (error) {
      throw error;
    }
  }

  async createTodo(token: string, todo: ICreateTodoDto): Promise<ITodoDto> {
    try {
      const result = await fetch(Constants?.manifest?.extra?.API_URL + '/todos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todo),
      });

      return await result.json();
    } catch (error) {
      throw error;
    }
  }
}
