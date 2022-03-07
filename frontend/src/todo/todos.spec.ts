import { setUser } from '../authentication/authenticationSlice';
import Store from '../tests/Store';

import { loadTodos } from './todos';
import { selectTodos } from './todosSlice';

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
});
