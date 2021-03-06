import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';

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

export const createTodo = (overrides: Partial<Todo> = {}): Todo => {
  return new Todo({
    id: 'id',
    user_id: 'user_id',
    title: 'title',
    description: 'description',
    checked: false,
    ...overrides,
  });
};
