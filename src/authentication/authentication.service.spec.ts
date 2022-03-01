import { Test, TestingModule } from '@nestjs/testing';

import { createUser } from '../tests/factories';
import { InMemoryUserRepository } from '../tests/in-memory-user.repository';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';
import { CryptoModule } from '../utils/crypto.module';
import { GeneratorModule } from '../utils/generator.module';

import { AuthenticationService } from './authentication.service';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userRepository: InMemoryUserRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [UserModule, CryptoModule, GeneratorModule],
      controllers: [AuthenticationController],
      providers: [AuthenticationService],
    }).compile();

    authenticationService = app.get(AuthenticationService);
    userRepository = app.get(UserRepository);
  });

  describe('signup', () => {
    it('creates a user', async () => {
      const createdUser = await authenticationService.createUser({
        username: 'azot',
        lastName: 'Toza',
        firstName: 'Azot',
        password: 'password',
      });
      const expectedUser = createUser({ token: 'token' });

      expect(createdUser).toMatchObject(expectedUser);

      expect(userRepository.users[0]).toMatchObject({
        id: expectedUser.id,
      });
    });
  });

  describe('login', () => {
    it('logs the user', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      const loggedUser = await authenticationService.logUser({
        username: 'azot',
        password: 'p4ssWord',
      });

      expect(loggedUser).toMatchObject(user);

      expect(userRepository.users[0].token).toEqual('token');
    });

    it('throws invalid credentials error if no user is found', async () => {
      await expect(
        authenticationService.logUser({
          username: 'azot',
          password: 'p4ssWord',
        }),
      ).rejects.toThrow(new InvalidCredentialsError());
    });
  });
});
