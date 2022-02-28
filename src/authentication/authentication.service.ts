import { Inject, Injectable } from '@nestjs/common';

import { User } from '../entities/User';
import { UserRepository } from '../user/user.repository';
import { CryptoPort } from '../utils/crypto.port';
import { GeneratorPort } from '../utils/generator.port';

import { CreateUserDto } from './dtos/create-user.dto';

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
}
