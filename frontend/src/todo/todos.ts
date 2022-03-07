import { ICreateTodoDto, ITodoDto } from 'todo-shared';

import { selectUserToken } from '../authentication/authenticationSlice';
import { AppThunkAction } from '../store';

import { addTodo, setTodos, setTodosError } from './todosSlice';

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
      dispatch(setTodosError(null));

      return loadedTodos;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setTodosError(error.message));
      }
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
      dispatch(setTodosError(null));

      return createdTodo;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setTodosError(error.message));
      }
    }
  };
