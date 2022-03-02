import { IsNotEmpty, Matches } from 'class-validator';
import { ISignupUserDto } from 'todo-shared';

export class CreateUserDto implements ISignupUserDto {
  @IsNotEmpty()
  username!: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  firstName!: string;
}
