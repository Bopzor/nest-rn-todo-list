import { setUser } from '../authentication/authenticationSlice';
import Store from '../tests/Store';

import { createTodo, loadTodos, updateTodo } from './todos';
import { selectTodos, setTodos } from './todosSlice';

describe('todos', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  describe('loadTodos', () => {
    it('loads todos for connected user', async () => {
      const user = {
        username: 'azot',
        password: 'p4ssWord',
        firstName: 'Azot',
        lastName: 'Toza',
      };
      store.dispatch(setUser({ ...user, id: '1', token: 'token' }));

      const loadedTodos = await store.dispatch(loadTodos());

      expect(store.select(selectTodos)).toEqual(loadedTodos);
    });
  });

  describe('createTodo', () => {
    it('creates a todo for connected user', async () => {
      const user = {
        username: 'azot',
        password: 'p4ssWord',
        firstName: 'Azot',
        lastName: 'Toza',
        id: '1',
        token: 'token',
      };
      store.dispatch(setUser(user));

      const todo = {
        title: 'title',
        description: 'description',
      };

      const createdTodo = await store.dispatch(createTodo(todo));

      expect(store.select(selectTodos)[0]).toEqual(createdTodo);
    });
  });

  describe('updateTodo', () => {
    it('updates the todo', async () => {
      const user = {
        username: 'azot',
        password: 'p4ssWord',
        firstName: 'Azot',
        lastName: 'Toza',
        id: '1',
        token: 'token',
      };
      store.dispatch(setUser(user));
      const todo = {
        id: 'todo-1',
        title: 'title',
        description: 'description',
      };
      store.dispatch(setTodos([todo]));
      store.todosGateway.todos = [todo];

      const updatedTodo = await store.dispatch(updateTodo(todo.id, { changes: { title: 'edited title' } }));

      expect(store.select(selectTodos)[0]).toEqual(updatedTodo);
    });
  });
});
