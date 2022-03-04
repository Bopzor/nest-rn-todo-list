import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { gql } from 'apollo-server-express';

import { createUser } from 'src/tests/factories';
import { ApolloServerTestClient, createApolloTestClient } from 'src/tests/create-apollo-test-client.ts';
import { ResolverForTest } from 'src/tests/test-query.revolver';
import { TestGraphqlModule } from 'src/tests/graphql/graphql.module';

import { AuthenticationModule } from '../authentication.module';
import { UsernameAlreadyExistError } from '../errors/username-already-exist.error';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { AuthenticationService } from '../service/authentication.service';

class MockAuthenticationService extends AuthenticationService {
  createUser = jest.fn();
  logUser = jest.fn();
}

describe('AuthenticationResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;
  let authenticationService: MockAuthenticationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthenticationModule, TestGraphqlModule],
      providers: [ResolverForTest],
    })
      .overrideProvider(AuthenticationService)
      .useClass(MockAuthenticationService)
      .compile();

    app = module.createNestApplication();
    app = app.useGlobalPipes(new ValidationPipe());

    await app.init();

    apolloClient = createApolloTestClient(module);
    authenticationService = app.get(AuthenticationService);
  });

  describe('signup', () => {
    it('creates a user', async () => {
      const user = createUser({ token: 'token' });

      await authenticationService.createUser.mockResolvedValueOnce(user);

      const response = await apolloClient.mutate({
        mutation: gql`
          mutation Signup($user: CreateUserDto!) {
            signup(user: $user) {
              username
              firstName
              lastName
              token
            }
          }
        `,
        variables: {
          user: {
            username: 'azot',
            lastName: 'Toza',
            firstName: 'Azot',
            password: 'p4ssWord',
          },
        },
      });

      expect(response.data.signup).toMatchObject({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
      });
    });

    it('throws an error if username is already taken', async () => {
      await authenticationService.createUser.mockRejectedValueOnce(new UsernameAlreadyExistError('azot'));

      const response = await apolloClient.mutate({
        mutation: gql`
          mutation Signup($user: CreateUserDto!) {
            signup(user: $user) {
              username
              firstName
              lastName
              token
            }
          }
        `,
        variables: {
          user: {
            username: 'azot',
            lastName: 'Toza',
            firstName: 'Azot',
            password: 'p4ssWord',
          },
        },
      });

      expect(response?.errors?.[0]).toHaveProperty('message', 'Username azot is already taken');
    });
  });

  describe('login', () => {
    it('logs in the existing user', async () => {
      const user = createUser({ token: 'token' });

      await authenticationService.logUser.mockResolvedValueOnce(user);

      const response = await apolloClient.mutate({
        mutation: gql`
          mutation Login($user: LogUserDto!) {
            login(user: $user) {
              username
              firstName
              lastName
              token
            }
          }
        `,
        variables: {
          user: {
            username: 'azot',
            password: 'p4ssWord',
          },
        },
      });

      expect(response.data.login).toMatchObject({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
      });
    });

    it('throws an error if credentials are not valid', async () => {
      await authenticationService.logUser.mockRejectedValueOnce(new InvalidCredentialsError());

      const response = await apolloClient.mutate({
        mutation: gql`
          mutation Login($user: LogUserDto!) {
            login(user: $user) {
              username
              firstName
              lastName
              token
            }
          }
        `,
        variables: {
          user: {
            username: 'toto',
            password: 'p4ssWord',
          },
        },
      });

      expect(response?.errors?.[0]).toHaveProperty('message', 'Given credentials are not valid');
    });
  });
});
