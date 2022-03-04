import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { RequestWithUser } from 'src/utils/request-with-user';

import { CreateUserDto } from '../dtos/create-user.dto';
import { LogUserDto } from '../dtos/log-user.dto';
import { UserDto } from '../dtos/user.dto';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { UsernameAlreadyExistError } from '../errors/username-already-exist.error';
import { IsNotAuth } from '../guards/is-not-authenticated.guard';
import { AuthenticationService } from '../service/authentication.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(IsNotAuth)
  @Post('signup')
  async signup(@Body() dto: CreateUserDto, @Req() request: RequestWithUser): Promise<UserDto> {
    try {
      const user = await this.authenticationService.createUser(dto);

      request.user = user;

      return new UserDto(user);
    } catch (error) {
      if (error instanceof UsernameAlreadyExistError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(IsNotAuth)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LogUserDto, @Req() request: RequestWithUser): Promise<UserDto> {
    try {
      const user = await this.authenticationService.logUser(dto);

      request.user = user;

      return new UserDto(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
