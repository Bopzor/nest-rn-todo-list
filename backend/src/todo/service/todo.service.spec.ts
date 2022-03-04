import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { InMemoryTodoRepository } from 'src/tests/in-memory-todo.repository';
import { createTodo, createUser } from 'src/tests/factories';
import { GeneratorModule } from 'src/utils/generator.module';

import { todoRepositoryProvider } from '../todo.module';
import { TodoController } from '../controller/todo.controller';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { TodoRepository } from '../repositories/todo.repository';

import { TodoService } from './todo.service';

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

  describe('toggleTodo', () => {
    it('toggles a todo if it match user id', async () => {
      const user = createUser();
      const todo = createTodo({ user_id: user.id });
      todoRepository.todos = [todo];

      await todoService.toggleTodo(user.id, todo.id);

      expect(todoRepository.todos[0]).toHaveProperty('checked', true);

      await todoService.toggleTodo(user.id, todo.id);

      expect(todoRepository.todos[0]).toHaveProperty('checked', false);
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

  describe('deleteTodo', () => {
    it('deletes a todo if it match user id', async () => {
      const user = createUser();
      const todo = createTodo({ user_id: user.id });
      todoRepository.todos = [todo];

      await todoService.deleteTodo(user.id, todo.id);

      expect(todoRepository.todos).toHaveLength(0);
    });

    it('throws a NOT FOUND error if no todo is found', async () => {
      const user = createUser();

      await expect(() => todoService.deleteTodo(user.id, 'todo-id')).rejects.toThrow(new NotFoundException());
    });

    it('throws a FORBIDDEN error if the todo is not associated to the user', async () => {
      const user = createUser();
      const todo = createTodo();
      todoRepository.todos = [todo];
      const dto: UpdateTodoDto = {
        title: 'edited title',
        description: 'edited description',
      };

      await expect(() => todoService.deleteTodo(user.id, todo.id)).rejects.toThrow(new ForbiddenException());
    });
  });
});
