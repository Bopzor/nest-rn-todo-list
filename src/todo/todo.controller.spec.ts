import { ForbiddenException, HttpStatus, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { SuperAgentTest } from 'supertest';

import { AuthorizationModule } from '../authorization/authorization.module';
import { InMemoryUserRepository } from '../tests/in-memory-user.repository';
import { createTodo, createUser } from '../tests/factories';
import { UserRepository } from '../user/user.repository';

import { TodoModule } from './todo.module';
import { TodoService } from './todo.service';
import { TodoDto } from './dtos/todo.dto';
import { CreateTodoDto } from './dtos/create-todo.dto';

class MockTodoService extends TodoService {
  getAllForUser = jest.fn();
  createTodo = jest.fn();
  updateTodo = jest.fn();
  toggleTodo = jest.fn();
  deleteTodo = jest.fn();
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

  describe('POST todos', () => {
    it('creates a todo', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'title',
        description: 'description',
      };
      const todo = createTodo({ ...body, user_id: user.id });

      await todoService.createTodo.mockResolvedValueOnce(todo);

      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${user.token}`)
        .send(body)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject(new TodoDto(todo));
    });

    it('creates a todo with an empty description', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'title',
      };
      const todo = createTodo({ ...body, user_id: user.id });

      await todoService.createTodo.mockResolvedValueOnce(todo);

      await agent.post('/todos').set('Authorization', `Bearer ${user.token}`).send(body).expect(HttpStatus.CREATED);
    });

    it('throws BAD REQUEST error if no title is given', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: '',
        description: 'description',
      };

      await agent.post('/todos').set('Authorization', `Bearer ${user.token}`).send(body).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH todos/:id', () => {
    it('edit a todo', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };
      const todo = createTodo({ ...body, user_id: user.id, id: 'id-1' });

      await todoService.updateTodo.mockResolvedValueOnce(todo);

      const response = await agent
        .patch(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(body)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject(new TodoDto(todo));
    });

    it('throws an error if todo is not one of the user', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };

      await todoService.updateTodo.mockRejectedValueOnce(new ForbiddenException());

      await agent
        .patch(`/todos/not-my-todo`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(body)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('throws an error if todo does not exist', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const body: CreateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };

      await todoService.updateTodo.mockRejectedValueOnce(new NotFoundException());

      await agent
        .patch(`/todos/not-my-todo`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(body)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH todos/:id/toggle', () => {
    it('toggles a todo', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const todo = createTodo({ user_id: user.id, id: 'id-1' });

      await todoService.toggleTodo.mockResolvedValueOnce({ ...todo, checked: !todo.checked });

      const response = await agent
        .patch(`/todos/${todo.id}/toggle`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject(new TodoDto({ ...todo, checked: !todo.checked }));
    });

    it('throws an error if todo is not one of the user', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const todo = createTodo({ user_id: user.id, id: 'id-1' });

      await todoService.toggleTodo.mockRejectedValueOnce(new ForbiddenException());

      await agent
        .patch(`/todos/${todo.id}/toggle`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('throws an error if todo is not found', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const todo = createTodo({ user_id: user.id, id: 'id-1' });

      await todoService.toggleTodo.mockRejectedValueOnce(new NotFoundException());

      await agent
        .patch(`/todos/${todo.id}/toggle`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE todos/:id', () => {
    it('deletes a todo', async () => {
      const user = createUser({ token: 'token' });
      userRepository.users = [user];
      const todo = createTodo({ user_id: user.id, id: 'id-1' });

      await todoService.deleteTodo.mockResolvedValueOnce(undefined);

      await agent
        .delete(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
