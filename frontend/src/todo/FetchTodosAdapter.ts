import Constants from 'expo-constants';

import { ICreateTodoDto, ITodoDto, IUpdateTodoDto } from 'todo-shared';

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

  async updateTodo(token: string, params: { id: string; changes: IUpdateTodoDto }): Promise<ITodoDto> {
    try {
      const result = await fetch(Constants?.manifest?.extra?.API_URL + `/todos/${params.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params.changes),
      });

      return await result.json();
    } catch (error) {
      throw error;
    }
  }

  async toggleTodo(token: string, id: string): Promise<ITodoDto> {
    try {
      const result = await fetch(Constants?.manifest?.extra?.API_URL + `/todos/${id}/toggle`, {
        method: 'PATCH',
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

  async deleteTodo(token: string, id: string): Promise<string> {
    try {
      await fetch(Constants?.manifest?.extra?.API_URL + `/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      throw error;
    }
  }
}
