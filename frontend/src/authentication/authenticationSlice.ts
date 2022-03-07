import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserDto } from 'todo-shared';

import { RootState } from '../store';

export interface AuthenticationState {
  user: IUserDto | null;
  error: string | null;
}

const initialState: AuthenticationState = {
  user: null,
  error: null,
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setUser: (state, { payload: user }: PayloadAction<AuthenticationState['user']>) => {
      state.user = user;
    },
    setAuthenticationError: (state, { payload: error }: PayloadAction<AuthenticationState['error']>) => {
      state.error = error;
    },
  },
});

export const { setUser, setAuthenticationError } = authenticationSlice.actions;

export const selectUser = (state: RootState) => state.authentication.user;
export const selectUserToken = (state: RootState) => state.authentication.user?.token;
export const selectAuthenticationError = (state: RootState) => state.authentication.error;

export default authenticationSlice.reducer;
