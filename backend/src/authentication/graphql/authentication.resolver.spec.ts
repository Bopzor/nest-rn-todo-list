import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { gql } from 'apollo-server-express';
import { ApolloServerTestClient } from 'apollo-server-testing';

import { AuthenticationModule } from '../../authentication/authentication.module';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UsernameAlreadyExistError } from '../../authentication/errors/username-already-exist.error';
import { createUser } from '../../tests/factories';
import { createApolloTestClient } from '../../tests/create-apollo-test-client.ts';
import { ResolverForTest } from '../../tests/test-query.revolver';
import { GraphqlModule } from '../../graphql/graphql.module';

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
      imports: [AuthenticationModule, GraphqlModule],
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
});
