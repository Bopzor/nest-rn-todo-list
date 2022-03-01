import { Test } from '@nestjs/testing';

import { InMemoryTodoRepository } from '../tests/in-memory-todo.repository';
import { createTodo } from '../tests/factories';

import { TodoController } from './todo.controller';
import { todoRepositoryProvider } from './todo.module';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: InMemoryTodoRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
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
});
