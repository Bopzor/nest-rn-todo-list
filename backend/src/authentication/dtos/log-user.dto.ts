import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ILoginUserDto } from 'todo-shared';

@ObjectType()
export class LogUserDto implements ILoginUserDto {
  @Field()
  @IsNotEmpty()
  username!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}
