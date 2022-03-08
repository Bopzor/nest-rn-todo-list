import Store from '../tests/Store';

import { NotMatchingPatternError } from './NotMatchingPatternError';
import { TooShortError } from './TooShortError';
import { validateLoginInput, validateSignupInput } from './validation';

describe('authentication', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  describe('validateSignupInput', () => {
    it('validates a fully complete signup input', () => {
      const signupUser = {
        username: 'azot',
        password: 'p4ssWord',
        firstName: 'Azot',
        lastName: 'Toza',
      };

      const validation = store.dispatch(validateSignupInput(signupUser));

      expect(validation.errors).toEqual({});
    });

    it.each([
      {
        fields: 'username',
        user: {
          username: 'a',
          password: 'p4ssWord',
          firstName: 'Azot',
          lastName: 'Toza',
        },
        expectErrors: {
          username: expect.any(TooShortError),
        },
      },
      {
        fields: 'lastName',
        user: {
          username: 'azot',
          password: 'p4ssWord',
          firstName: 'Azot',
          lastName: 'T',
        },
        expectErrors: {
          lastName: expect.any(TooShortError),
        },
      },
      {
        fields: 'firstName',
        user: {
          username: 'azot',
          password: 'p4ssWord',
          firstName: 'A',
          lastName: 'Toza',
        },
        expectErrors: {
          firstName: expect.any(TooShortError),
        },
      },
      {
        fields: 'password',
        user: {
          username: 'azot',
          password: 'password',
          firstName: 'Azot',
          lastName: 'Toza',
        },
        expectErrors: {
          password: expect.any(NotMatchingPatternError),
        },
      },
      {
        fields: 'all',
        user: {
          username: '',
          password: '',
          firstName: '',
          lastName: '',
        },
        expectErrors: {
          username: expect.any(TooShortError),
          lastName: expect.any(TooShortError),
          firstName: expect.any(TooShortError),
          password: expect.any(NotMatchingPatternError),
        },
      },
    ])('set $fields in error', ({ user, expectErrors }) => {
      const validation = store.dispatch(validateSignupInput(user));

      expect(validation.errors).toEqual(expectErrors);
    });
  });

  describe('validateLoginInput', () => {
    it.each([
      {
        fields: 'username',
        user: {
          username: 'a',
          password: 'p4ssWord',
          firstName: 'Azot',
          lastName: 'Toza',
        },
        expectErrors: {
          username: expect.any(TooShortError),
        },
      },
      {
        fields: 'password',
        user: {
          username: 'azot',
          password: 'password',
          firstName: 'Azot',
          lastName: 'Toza',
        },
        expectErrors: {
          password: expect.any(NotMatchingPatternError),
        },
      },
      {
        fields: 'all',
        user: {
          username: '',
          password: '',
          firstName: '',
          lastName: '',
        },
        expectErrors: {
          username: expect.any(TooShortError),
          password: expect.any(NotMatchingPatternError),
        },
      },
    ])('set $fields in error', ({ user, expectErrors }) => {
      const validation = store.dispatch(validateLoginInput(user));

      expect(validation.errors).toEqual(expectErrors);
    });
  });
});
