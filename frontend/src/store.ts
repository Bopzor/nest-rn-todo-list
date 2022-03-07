import { AnyAction, configureStore, Selector, ThunkAction } from '@reduxjs/toolkit';

import { AuthenticationPort } from './authentication/AuthenticationPort';
import authenticationReducer from './authentication/authenticationSlice';
import { TodosPort } from './todo/TodosPort';
import todosReducer from './todo/todosSlice';

type Dependencies = {
  authenticationGateway: AuthenticationPort;
  todosGateway: TodosPort;
};

export const createStore = (dependencies: Dependencies) =>
  configureStore({
    reducer: {
      authentication: authenticationReducer,
      todos: todosReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      }),
  });

type Store = ReturnType<typeof createStore>;

export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
export type AppThunkAction<Result> = ThunkAction<Result, RootState, Dependencies, AnyAction>;
export type AppSelector<Result, Params extends unknown[]> = Selector<RootState, Result, Params>;
