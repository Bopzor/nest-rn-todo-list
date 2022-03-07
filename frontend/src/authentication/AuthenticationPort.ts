import { ILoginUserDto, ISignupUserDto, IUserDto } from 'todo-shared';

export interface AuthenticationPort {
  signup(user: ISignupUserDto): Promise<IUserDto>;
  login(user: ILoginUserDto): Promise<IUserDto>;
}
