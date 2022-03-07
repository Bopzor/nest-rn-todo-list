import Store from '../tests/Store';

import { signup } from './authentication';
import { selectAuthenticationError, selectUser } from './authenticationSlice';

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

      expect(store.select(selectUser)).toEqual(createdUser);
    });

    it('sets authentication error if username already exist', async () => {
      const user = {
        username: 'azot',
        password: 'p4ssWord',
        firstName: 'Azot',
        lastName: 'Toza',
      };
      store.authenticationGateway.users = [{ ...user, id: '1', token: 'token' }];

      await store.dispatch(signup(user));

      expect(store.select(selectAuthenticationError)).toEqual('Username already exist');
    });
  });
});
