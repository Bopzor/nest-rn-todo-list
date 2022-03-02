import { ISignupUserDto, IUserDto } from 'todo-shared';
import { AuthenticationPort } from '../authentication/AuthenticationPort';

export class InMemoryAuthenticationAdapter implements AuthenticationPort {
  async signup(user: ISignupUserDto): Promise<IUserDto> {
    return {
      id: 'id',
      token: 'token',
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
