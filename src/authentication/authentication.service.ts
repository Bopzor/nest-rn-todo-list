import { Inject, Injectable } from '@nestjs/common';

import { User } from '../entities/User';
import { UserRepository } from '../user/user.repository';
import { CryptoPort } from '../utils/crypto.port';
import { GeneratorPort } from '../utils/generator.port';

import { CreateUserDto } from './dtos/create-user.dto';
import { LogUserDto } from './dtos/log-user.dto';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

@Injectable()
export class AuthenticationService {
  constructor(private userRepository: UserRepository, private crypto: CryptoPort, private generator: GeneratorPort) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const id = this.generator.generateId();
    const hashedPassword = await this.crypto.hashPassword(dto.password);

    const user = new User({
      id,
      username: dto.username,
      lastName: dto.lastName,
      firstName: dto.firstName,
      hashedPassword,
      token: this.generator.generateToken(),
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

    const user = new User({ ...userAttributes, token: this.generator.generateToken() });

    await this.userRepository.save(user);

    return user;
  }
}
