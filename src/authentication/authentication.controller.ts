import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsernameAlreadyExistError } from './errors/username-already-exist.error';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<UserDto> {
    try {
      const user = await this.authenticationService.createUser(dto);

      return new UserDto(user);
    } catch (error) {
      if (error instanceof UsernameAlreadyExistError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
