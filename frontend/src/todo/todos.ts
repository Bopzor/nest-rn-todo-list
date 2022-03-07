import { ICreateTodoDto, ITodoDto, IUpdateTodoDto } from 'todo-shared';

import { selectUserToken } from '../authentication/authenticationSlice';
import { AppThunkAction } from '../store';

import { addTodo, editTodo, setTodos } from './todosSlice';

export const loadTodos =
  (): AppThunkAction<Promise<ITodoDto[] | undefined>> =>
  async (dispatch, getState, { todosGateway }) => {
    try {
      const token = selectUserToken(getState());

      if (!token) {
        throw new Error('No user is authenticated');
      }

      const loadedTodos = await todosGateway.loadTodos(token);

      dispatch(setTodos(loadedTodos));

      return loadedTodos;
    } catch (error) {
      console.error(error);
    }
  };

export const createTodo =
  (todo: ICreateTodoDto): AppThunkAction<Promise<ITodoDto | undefined>> =>
  async (dispatch, getState, { todosGateway }) => {
    try {
      const token = selectUserToken(getState());

      if (!token) {
        throw new Error('No user is authenticated');
      }

      const createdTodo = await todosGateway.createTodo(token, todo);

      dispatch(addTodo(createdTodo));

      return createdTodo;
    } catch (error) {
      console.error(error);
    }
  };

export const updateTodo =
  (id: string, params: { changes: IUpdateTodoDto }): AppThunkAction<Promise<ITodoDto | undefined>> =>
  async (dispatch, getState, { todosGateway }) => {
    try {
      const token = selectUserToken(getState());

      if (!token) {
        throw new Error('No user is authenticated');
      }

      const updatedTodo = await todosGateway.updateTodo(token, { id, ...params });

      dispatch(editTodo({ id, ...params }));

      return updatedTodo;
    } catch (error) {
      console.error(error);
    }
  };

export const toggleTodo =
  (id: string): AppThunkAction<Promise<ITodoDto | undefined>> =>
  async (dispatch, getState, { todosGateway }) => {
    try {
      const token = selectUserToken(getState());

      if (!token) {
        throw new Error('No user is authenticated');
      }

      const toggledTodo = await todosGateway.toggleTodo(token, id);

      dispatch(editTodo({ id, changes: { checked: toggledTodo.checked } }));

      return toggledTodo;
    } catch (error) {
      console.error(error);
    }
  };
