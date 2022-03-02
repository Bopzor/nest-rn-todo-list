import { IsNotEmpty } from 'class-validator';
import { ILoginUserDto } from 'todo-shared';

export class LogUserDto implements ILoginUserDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;
}
