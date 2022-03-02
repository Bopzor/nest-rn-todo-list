import Store from '../tests/Store';

import { signup } from './authentication';
import { selectUser } from './authenticationSlice';

describe('authentication', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  describe('signup', () => {
    it('creates as user', async () => {
      const user = {
        username: 'azot',
        password: 'p4ssWord',
        firstName: 'Azot',
        lastName: 'Toza',
      };

      const createdUser = await store.dispatch(signup(user));

      expect(store.select(selectUser)).toMatchObject(createdUser);
    });
  });
});
