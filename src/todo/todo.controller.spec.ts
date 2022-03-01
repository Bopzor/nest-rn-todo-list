import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { SuperAgentTest } from 'supertest';

import { AuthorizationModule } from '../authorization/authorization.module';
import { InMemoryUserRepository } from '../tests/in-memory-user.repository';
import { createUser } from '../tests/factories';
import { UserRepository } from '../user/user.repository';

import { TodoModule } from './todo.module';
import { TodoService } from './todo.service';

class MockTodoService extends TodoService {
  getAllForUser = jest.fn();
}

describe('TodoController', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;
  let todoService: MockTodoService;
  let userRepository: InMemoryUserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthorizationModule, TodoModule],
    })
      .overrideProvider(TodoService)
      .useClass(MockTodoService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    todoService = app.get(TodoService);
    userRepository = app.get(UserRepository);
    agent = request.agent(app.getHttpServer());
  });

  describe('GET todos', () => {
    it('gets all todos of connected user', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];

      await todoService.getAllForUser.mockResolvedValueOnce([]);

      const response = await agent.get('/todos').set('Authorization', `Bearer ${user.token}`).expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });

    it('throws Forbidden error if no user is connected', async () => {
      await agent.get('/todos').expect(HttpStatus.FORBIDDEN);
    });
  });
});
