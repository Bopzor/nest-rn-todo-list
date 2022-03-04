import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ILoginUserDto } from 'todo-shared';

@InputType()
export class LogUserDto implements ILoginUserDto {
  @Field()
  @IsNotEmpty()
  username!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}
