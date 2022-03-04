import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';
import { LogUserDto } from '../dtos/log-user.dto';
import { UserDto } from '../dtos/user.dto';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { UsernameAlreadyExistError } from '../errors/username-already-exist.error';
import { GqlIsNotAuth } from '../guards/is-not-authenticated.guard';
import { AuthenticationService } from '../service/authentication.service';

@Resolver(() => User)
export class AuthenticationResolver {
  constructor(private authenticationService: AuthenticationService) {}

  @UseGuards(GqlIsNotAuth)
  @Mutation((returns) => UserDto)
  async signup(@Args('user') dto: CreateUserDto, @Context() context: { req?: { user?: User } }): Promise<UserDto> {
    try {
      const user = await this.authenticationService.createUser(dto);

      if (!context.req) {
        context.req = {};
      }

      context.req.user = user;

      return new UserDto(user);
    } catch (error) {
      if (error instanceof UsernameAlreadyExistError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(GqlIsNotAuth)
  @Mutation((returns) => UserDto)
  async login(@Args('user') dto: LogUserDto, @Context() context: { req?: { user?: User } }): Promise<UserDto> {
    try {
      const user = await this.authenticationService.logUser(dto);

      if (!context.req) {
        context.req = {};
      }

      context.req.user = user;

      return new UserDto(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
