import { ISignupUserDto, IUserDto } from 'todo-shared';

import { AppThunkAction } from '../store';

import { setAuthenticationError, setUser } from './authenticationSlice';

export const signup =
  (user: ISignupUserDto): AppThunkAction<Promise<IUserDto | undefined>> =>
  async (dispatch, _getState, { authenticationGateway }) => {
    try {
      const createdUser = await authenticationGateway.signup(user);

      dispatch(setUser(createdUser));
      dispatch(setAuthenticationError(null));

      return createdUser;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setAuthenticationError(error.message));
      }
    }
  };
