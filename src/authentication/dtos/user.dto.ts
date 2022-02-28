import { IsNotEmpty, Matches } from 'class-validator';
import { User } from 'entities/User';

export class UserDto {
  constructor(user: User) {
    Object.assign(this, user);
  }

  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  token!: string;
}
