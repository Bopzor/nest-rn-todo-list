import { ForbiddenException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
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
import { CreateTodoDto } from '../dtos/create-todo.dto';

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

    it('returns a Forbidden error if no user is connected', async () => {
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

  describe('createTodo', () => {
    it('creates a todo', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'title',
        description: 'description',
      };
      const todo = createTodo({ ...body, user_id: user.id });

      await todoService.createTodo.mockResolvedValueOnce(todo);

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user: createUser(),
          },
        },
        mutation: gql`
          mutation CreateTodo($todo: CreateTodoDto!) {
            createTodo(todo: $todo) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          todo: {
            title: 'title',
            description: 'description',
          },
        },
      });

      expect(response.data.createTodo).toMatchObject({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        checked: todo.checked,
      });
    });

    it('creates a todo with an empty description', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'title',
      };
      const todo = createTodo({ ...body, description: undefined, user_id: user.id });

      await todoService.createTodo.mockResolvedValueOnce(todo);

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user: createUser(),
          },
        },
        mutation: gql`
          mutation CreateTodo($todo: CreateTodoDto!) {
            createTodo(todo: $todo) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          todo: {
            title: 'title',
          },
        },
      });

      expect(response.data.createTodo).toMatchObject({
        id: todo.id,
        title: todo.title,
        description: null,
        checked: todo.checked,
      });
    });

    it('returns an error if no title is given', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        mutation: gql`
          mutation CreateTodo($todo: CreateTodoDto!) {
            createTodo(todo: $todo) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          todo: {
            description: 'description',
          },
        },
      });

      expect(response.errors).toHaveLength(1);
    });
  });

  describe('editTodo', () => {
    it('edit a todo', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };
      const todo = createTodo({ ...body, user_id: user.id, id: 'id-1' });

      await todoService.updateTodo.mockResolvedValueOnce(todo);

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        mutation: gql`
          mutation UpdateTodo($id: String!, $todo: UpdateTodoDto!) {
            updateTodo(id: $id, todo: $todo) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          id: todo.id,
          todo: {
            description: 'description',
          },
        },
      });

      expect(response.data.updateTodo).toMatchObject({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        checked: todo.checked,
      });
    });

    it('returns an error if todo is not one of the user', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      await todoService.updateTodo.mockRejectedValueOnce(new ForbiddenException());

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        mutation: gql`
          mutation UpdateTodo($id: String!, $todo: UpdateTodoDto!) {
            updateTodo(id: $id, todo: $todo) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          id: 'not-my-todo',
          todo: {
            description: 'description',
          },
        },
      });

      expect(response.errors?.[0]).toHaveProperty('message', 'Forbidden');
    });

    it('returns an error if todo does not exist', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      await todoService.updateTodo.mockRejectedValueOnce(new NotFoundException());

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        mutation: gql`
          mutation UpdateTodo($id: String!, $todo: UpdateTodoDto!) {
            updateTodo(id: $id, todo: $todo) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          id: 'not-found-todo',
          todo: {
            description: 'description',
          },
        },
      });

      expect(response.errors?.[0]).toHaveProperty('message', 'Not Found');
    });
  });

  describe('toggleTodo', () => {
    it('toggles a todo', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const todo = createTodo({ user_id: user.id, id: 'id-1' });

      await todoService.toggleTodo.mockResolvedValueOnce({ ...todo, checked: !todo.checked });

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        mutation: gql`
          mutation toggleTodo($id: String!) {
            toggleTodo(id: $id) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          id: todo.id,
        },
      });

      expect(response.data.toggleTodo).toMatchObject({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        checked: !todo.checked,
      });
    });

    it('returns an error if todo is not one of the user', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      await todoService.toggleTodo.mockRejectedValueOnce(new ForbiddenException());

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        mutation: gql`
          mutation toggleTodo($id: String!) {
            toggleTodo(id: $id) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          id: 'not-my-todo',
        },
      });

      expect(response.errors?.[0]).toHaveProperty('message', 'Forbidden');
    });

    it('returns an error if todo does not exist', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      await todoService.toggleTodo.mockRejectedValueOnce(new NotFoundException());

      const response = await apolloClient.mutate({
        integrationContextArgument: {
          req: {
            user,
          },
        },
        mutation: gql`
          mutation ToggleTodo($id: String!) {
            toggleTodo(id: $id) {
              id
              title
              description
              checked
            }
          }
        `,
        variables: {
          id: 'not-found-todo',
        },
      });

      expect(response.errors?.[0]).toHaveProperty('message', 'Not Found');
    });
  });
});
