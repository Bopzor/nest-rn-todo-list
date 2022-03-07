import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ITodoDto } from 'todo-shared';

import { RootState } from '../store';

const todosAdapter = createEntityAdapter<ITodoDto>();

export const todosSlice = createSlice({
  name: 'todos',
  initialState: todosAdapter.getInitialState(),
  reducers: {
    setTodos: todosAdapter.setAll,
    addTodo: todosAdapter.addOne,
    editTodo: todosAdapter.updateOne,
    removeTodo: todosAdapter.removeOne,
  },
});

export const { addTodo, editTodo, removeTodo, setTodos } = todosSlice.actions;

export const todosSelector = todosAdapter.getSelectors<RootState>((state) => state.todos);
export const selectTodos = todosSelector.selectAll;

export default todosSlice.reducer;
