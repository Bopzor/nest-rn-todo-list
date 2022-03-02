import { Exclude } from 'class-transformer';

import { User } from '../../user/user.entity';

export class UserDto {
  constructor(user: User) {
    Object.assign(this, user);
  }

  username!: string;

  @Exclude()
  hashedPassword!: string;

  lastName!: string;

  firstName!: string;

  token!: string;
}
