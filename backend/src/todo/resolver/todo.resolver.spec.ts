import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { gql } from 'apollo-server-express';

import { AuthorizationModule } from 'src/authorization/authorization.module';
import { createTodo, createUser } from 'src/tests/factories';
import { ApolloServerTestClient, createApolloTestClient } from 'src/tests/create-apollo-test-client.ts';
import { ResolverForTest } from 'src/tests/test-query.revolver';
import { UserRepository } from 'src/user/repositories/user.repository';
import { InMemoryUserRepository } from 'src/tests/in-memory-user.repository';
import { TestGraphqlModule } from 'src/tests/graphql/graphql.module';

import { TodoService } from '../service/todo.service';
import { TodoModule } from '../todo.module';

class MockTodoService extends TodoService {
  getAllForUser = jest.fn();
  createTodo = jest.fn();
  updateTodo = jest.fn();
  toggleTodo = jest.fn();
  deleteTodo = jest.fn();
}

describe('TodoResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;
  let todoService: MockTodoService;
  let userRepository: InMemoryUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthorizationModule, TodoModule, TestGraphqlModule],
      providers: [ResolverForTest],
    })
      .overrideProvider(TodoService)
      .useClass(MockTodoService)
      .compile();

    app = module.createNestApplication();
    app = app.useGlobalPipes(new ValidationPipe());

    await app.init();

    apolloClient = createApolloTestClient(module);
    todoService = app.get(TodoService);
    userRepository = app.get(UserRepository);
  });

  describe('getAllTodos', () => {
    it('gets all todos of connected user', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      await todoService.getAllForUser.mockResolvedValueOnce([]);

      const response = await apolloClient.query({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        query: gql`
          query todos {
            todos {
              title
              description
              checked
            }
          }
        `,
      });

      expect(response.data.todos).toMatchObject([]);
    });

    it('throws Forbidden error if no user is connected', async () => {
      const response = await apolloClient.query({
        query: gql`
          query todos {
            todos {
              title
              description
              checked
            }
          }
        `,
      });

      expect(response.errors?.[0]).toHaveProperty('message', 'Forbidden resource');
    });
  });

            title
            description
            checked
          }
        `,
      });

      console.log(response);

      expect(response.data.getAllTodos.toMatchObject([]));
    });
  });
});
