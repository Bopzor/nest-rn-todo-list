import { ISignupUserDto, IUserDto } from 'todo-shared';

import { AuthenticationPort } from '../authentication/AuthenticationPort';

export class InMemoryAuthenticationAdapter implements AuthenticationPort {
  users: IUserDto[] = [];

  async signup(user: ISignupUserDto): Promise<IUserDto> {
    const existingUser = this.users.find((u) => u.username === user.username);

    if (existingUser) {
      throw new Error('Username already exist');
    }

    return {
      id: 'id',
      token: 'token',
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
