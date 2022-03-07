import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITodoDto } from 'todo-shared';

import { RootState } from '../store';

export interface TodosState {
  todos: ITodoDto[];
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  error: null,
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, { payload: todos }: PayloadAction<TodosState['todos']>) => {
      state.todos = todos;
    },
    addTodo: (state, { payload: todo }: PayloadAction<ITodoDto>) => {
      state.todos.push(todo);
    },
    setTodosError: (state, { payload: error }: PayloadAction<TodosState['error']>) => {
      state.error = error;
    },
  },
});

export const { addTodo, setTodos, setTodosError } = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectTodoError = (state: RootState) => state.todos.error;

export default todosSlice.reducer;
