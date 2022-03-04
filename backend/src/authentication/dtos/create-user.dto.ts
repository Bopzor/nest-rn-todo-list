import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';
import { ISignupUserDto } from 'todo-shared';

@InputType()
export class CreateUserDto implements ISignupUserDto {
  @Field()
  @IsNotEmpty()
  username!: string;

  @Field()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password!: string;

  @Field()
  @IsNotEmpty()
  lastName!: string;

  @Field()
  @IsNotEmpty()
  firstName!: string;
}
