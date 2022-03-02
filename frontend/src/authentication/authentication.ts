import { ISignupUserDto, IUserDto } from 'todo-shared';

import { AppThunkAction } from '../store';

import { setUser } from './authenticationSlice';

export const signup =
  (user: ISignupUserDto): AppThunkAction<Promise<IUserDto>> =>
  async (dispatch, _getState, { authenticationGateway }) => {
    const createdUser = await authenticationGateway.signup(user);

    dispatch(setUser(createdUser));

    return createdUser;
  };
