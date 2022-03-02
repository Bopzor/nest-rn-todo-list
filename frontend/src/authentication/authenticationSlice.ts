import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserDto } from 'todo-shared';

import { RootState } from '../store';

export interface AuthenticationState {
  user: IUserDto | null;
}

const initialState: AuthenticationState = {
  user: null,
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setUser: (state, { payload: user }: PayloadAction<IUserDto>) => {
      state.user = user;
    },
  },
});

export const { setUser } = authenticationSlice.actions;

export const selectUser = (state: RootState) => state.authentication.user;

export default authenticationSlice.reducer;
