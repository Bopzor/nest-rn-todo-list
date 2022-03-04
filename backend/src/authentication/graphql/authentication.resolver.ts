import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { UsernameAlreadyExistError } from '../../authentication/errors/username-already-exist.error';
import { AuthenticationService } from '../../authentication/authentication.service';
import { CreateUserDto } from '../../authentication/dtos/create-user.dto';
import { UserDto } from '../../authentication/dtos/user.dto';
import { User } from '../../user/user.entity';
import { LogUserDto } from '../../authentication/dtos/log-user.dto';
import { InvalidCredentialsError } from '../../authentication/errors/invalid-credentials.error';

@Resolver(() => User)
export class AuthenticationResolver {
  constructor(private authenticationService: AuthenticationService) {}

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
