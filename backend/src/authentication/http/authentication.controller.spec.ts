import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { SuperAgentTest } from 'supertest';

import { createUser } from '../../tests/factories';

import { AuthenticationModule } from '../authentication.module';
import { AuthenticationService } from '../authentication.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LogUserDto } from '../dtos/log-user.dto';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { UsernameAlreadyExistError } from '../errors/username-already-exist.error';

class MockAuthenticationService extends AuthenticationService {
  createUser = jest.fn();
  logUser = jest.fn();
}

describe('AuthenticationController', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;
  let authenticationService: MockAuthenticationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthenticationModule],
    })
      .overrideProvider(AuthenticationService)
      .useClass(MockAuthenticationService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    authenticationService = app.get(AuthenticationService);
    agent = request.agent(app.getHttpServer());
  });

  describe('POST signup', () => {
    it('creates a user', async () => {
      const body: CreateUserDto = {
        username: 'azot',
        lastName: 'Toza',
        firstName: 'Azot',
        password: 'p4ssWord',
      };
      const user = createUser({ token: 'token' });

      await authenticationService.createUser.mockResolvedValueOnce(user);

      const response = await agent.post('/auth/signup').send(body);
      expect(response.body).toMatchObject({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
      });

      expect(authenticationService.createUser).toHaveBeenCalledWith(body);
    });

    it('throws an error if username is already taken', async () => {
      const body: CreateUserDto = {
        username: 'azot',
        lastName: 'Toza',
        firstName: 'Azot',
        password: 'p4ssWord',
      };

      await authenticationService.createUser.mockRejectedValueOnce(new UsernameAlreadyExistError(body.username));

      await agent.post('/auth/signup').send(body).expect(HttpStatus.BAD_REQUEST);
    });

    it('throws an error if password is not secure', async () => {
      const body: CreateUserDto = {
        username: 'azot',
        lastName: 'Toza',
        firstName: 'Azot',
        password: 'password',
      };

      await authenticationService.createUser.mockRejectedValueOnce(new UsernameAlreadyExistError(body.username));

      await agent.post('/auth/signup').send(body).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST login', () => {
    it('logs in the existing user', async () => {
      const user = createUser({ token: 'token' });

      const body: LogUserDto = {
        username: 'azot',
        password: 'p4ssWord',
      };

      await authenticationService.logUser.mockResolvedValueOnce(user);

      const response = await agent.post('/auth/login').send(body).expect(HttpStatus.OK);
      expect(response.body).toMatchObject({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
      });

      expect(authenticationService.logUser).toHaveBeenCalledWith(body);
    });

    it('throws an error if credentials are not valid', async () => {
      const body: LogUserDto = {
        username: 'toto',
        password: 'p4ssWord',
      };

      await authenticationService.logUser.mockRejectedValueOnce(new InvalidCredentialsError());

      await agent.post('/auth/login').send(body).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
