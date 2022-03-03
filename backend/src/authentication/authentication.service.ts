import { Injectable } from '@nestjs/common';

import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { CryptoPort } from '../utils/crypto.port';
import { GeneratorPort } from '../utils/generator.port';

import { CreateUserDto } from './dtos/create-user.dto';
import { LogUserDto } from './dtos/log-user.dto';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { UsernameAlreadyExistError } from './errors/username-already-exist.error';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly crypto: CryptoPort,
    private readonly generator: GeneratorPort,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const userAttributes = await this.userRepository.findByUsername(dto.username);

    if (userAttributes) {
      throw new UsernameAlreadyExistError(userAttributes.username);
    }

    const id = this.generator.generateId();
    const hashedPassword = await this.crypto.hashPassword(dto.password);

    const user = new User({
      id,
      username: dto.username,
      lastName: dto.lastName,
      firstName: dto.firstName,
      hashedPassword,
      token: this.generator.generateToken({ username: dto.username, userId: id }),
    });

    await this.userRepository.save(user);

    return user;
  }

  async logUser(dto: LogUserDto): Promise<User> {
    const userAttributes = await this.userRepository.findByUsername(dto.username);

    if (!userAttributes) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await this.crypto.compare(dto.password, userAttributes.hashedPassword);

    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    const user = new User({
      ...userAttributes,
      token: this.generator.generateToken({ username: userAttributes.username, userId: userAttributes.id }),
    });

    await this.userRepository.save(user);

    return user;
  }
}
