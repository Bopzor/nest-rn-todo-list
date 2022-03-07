import { ITodoDto } from 'todo-shared';

import { selectUserToken } from '../authentication/authenticationSlice';
import { AppThunkAction } from '../store';

import { setTodos, setTodosError } from './todosSlice';

export const loadTodos =
  (): AppThunkAction<Promise<ITodoDto[] | undefined>> =>
  async (dispatch, getState, { todosGateway: todoGateway }) => {
    try {
      const token = selectUserToken(getState());

      if (!token) {
        throw new Error('No user is authenticated');
      }

      const loadedTodos = await todoGateway.loadTodos(token);

      dispatch(setTodos(loadedTodos));
      dispatch(setTodosError(null));

      return loadedTodos;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setTodosError(error.message));
      }
    }
  };
