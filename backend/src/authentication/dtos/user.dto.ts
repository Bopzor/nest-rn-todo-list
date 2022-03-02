import { Exclude } from 'class-transformer';
import { IUserDto } from 'todo-shared';

import { User } from '../../user/user.entity';

export class UserDto implements IUserDto {
  constructor(user: User) {
    Object.assign(this, user);
  }

  id!: string;

  username!: string;

  @Exclude()
  hashedPassword!: string;

  lastName!: string;

  firstName!: string;

  token!: string;
}
