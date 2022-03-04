import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IUserDto } from 'todo-shared';

import { User } from '../../user/user.entity';

@ObjectType()
export class UserDto implements IUserDto {
  constructor(user: User) {
    Object.assign(this, user);
  }

  @Field()
  id!: string;

  @Field()
  username!: string;

  @Exclude()
  hashedPassword!: string;

  @Field()
  lastName!: string;

  @Field()
  firstName!: string;

  @Field()
  token!: string;
}
