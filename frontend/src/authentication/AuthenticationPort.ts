import { ISignupUserDto, IUserDto } from 'todo-shared';

export interface AuthenticationPort {
  signup(user: ISignupUserDto): Promise<IUserDto>;
}
