import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { InMemoryTodoRepository } from '../tests/in-memory-todo.repository';
import { createTodo, createUser } from '../tests/factories';
import { GeneratorModule } from '../utils/generator.module';

import { TodoController } from './todo.controller';
import { todoRepositoryProvider } from './todo.module';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: InMemoryTodoRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [GeneratorModule],
      controllers: [TodoController],
      providers: [TodoService, todoRepositoryProvider],
    }).compile();

    todoService = app.get(TodoService);
    todoRepository = app.get(TodoRepository);
  });

  describe('getAllForUser', () => {
    it('gets all todos for given user id', async () => {
      const todos = [createTodo(), createTodo({ user_id: 'other_user' })];
      todoRepository.todos = todos;

      expect(await todoService.getAllForUser('user_id')).toMatchObject([todos[0]]);
    });

    it('gets an empty array if no todos are find for given user id', async () => {
      const todos = [createTodo({ user_id: 'other_user' })];
      todoRepository.todos = todos;

      expect(await todoService.getAllForUser('user_id')).toMatchObject([]);
    });
  });

  describe('createTodoForUser', () => {
    it('creates a todo associated to given user', async () => {
      const user = createUser();
      const todo: CreateTodoDto = {
        title: 'title',
      };

      await todoService.createTodoForUser(user.id, todo);

      expect(todoRepository.todos[0]).toMatchObject({
        ...todo,
        user_id: user.id,
        checked: false,
      });
    });
  });

  describe('updateTodo', () => {
    it('updates a todo if it match user id', async () => {
      const user = createUser();
      const todo = createTodo({ user_id: user.id });
      todoRepository.todos = [todo];

      const dto: UpdateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };

      await todoService.updateTodo(user.id, todo.id, dto);

      expect(todoRepository.todos[0]).toHaveProperty('title', dto.title);
      expect(todoRepository.todos[0]).toHaveProperty('description', dto.description);
    });

    it("updates a todo's title only", async () => {
      const user = createUser();
      const todo = createTodo({ user_id: user.id });
      todoRepository.todos = [todo];

      const dto: UpdateTodoDto = {
        title: 'edited title',
      };

      await todoService.updateTodo(user.id, todo.id, dto);

      expect(todoRepository.todos[0]).toHaveProperty('title', dto.title);
      expect(todoRepository.todos[0]).toHaveProperty('description', todo.description);
    });

    it("updates a todo's description only", async () => {
      const user = createUser();
      const todo = createTodo({ user_id: user.id });
      todoRepository.todos = [todo];

      const dto: UpdateTodoDto = {
        description: 'edited description',
      };

      await todoService.updateTodo(user.id, todo.id, dto);

      expect(todoRepository.todos[0]).toHaveProperty('title', todo.title);
      expect(todoRepository.todos[0]).toHaveProperty('description', dto.description);
    });

    it('throws a NOT FOUND error if no todo is found', async () => {
      const user = createUser();
      const dto: UpdateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };

      await expect(() => todoService.updateTodo(user.id, 'todo-id', dto)).rejects.toThrow(new NotFoundException());
    });

    it('throws a FORBIDDEN error if the todo is not associated to the user', async () => {
      const user = createUser();
      const todo = createTodo();
      todoRepository.todos = [todo];
      const dto: UpdateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };

      await expect(() => todoService.updateTodo(user.id, todo.id, dto)).rejects.toThrow(new ForbiddenException());
    });
  });
});
