import { IsNotEmpty } from 'class-validator';

export class LogUserDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;
}
