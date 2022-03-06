import { Test } from '@nestjs/testing';
import expect from 'expect';

import { createUser } from 'src/tests/factories';
import { InMemoryUserRepository } from 'src/tests/in-memory-user.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserModule } from 'src/user/user.module';
import { CryptoModule } from 'src/utils/crypto.module';
import { GeneratorModule } from 'src/utils/generator.module';

import { AuthenticationService } from './authentication.service';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { AuthenticationController } from '../controller/authentication.controller';
import { UsernameAlreadyExistError } from '../errors/username-already-exist.error';

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

      expect(createdUser).toEqual(expectedUser);

      expect(userRepository.users[0]).toMatchObject({
        id: expectedUser.id,
      });
    });

    it('throws an error if username if already taken', async () => {
      userRepository.users = [createUser()];

      await expect(() =>
        authenticationService.createUser({
          username: 'azot',
          lastName: 'Toza',
          firstName: 'Azot',
          password: 'password',
        }),
      ).rejects.toThrow(new UsernameAlreadyExistError('azot'));
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

      expect(loggedUser).toEqual(user);

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
