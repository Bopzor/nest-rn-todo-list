import { User } from '../entities/User';

export const createUser = (overrides: Partial<User> = {}): User => {
  return new User({
    id: 'id',
    username: 'azot',
    lastName: 'Toza',
    firstName: 'Azot',
    hashedPassword: 'hashedPassword',
    ...overrides,
  });
};
