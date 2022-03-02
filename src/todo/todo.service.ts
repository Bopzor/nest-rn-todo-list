import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { GeneratorPort } from '../utils/generator.port';
import { Todo } from '../entities/Todo';

import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoRepository } from './todo.repository';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository, private readonly generator: GeneratorPort) {}

  async getAllForUser(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAllForUser(userId);
  }

  async createTodoForUser(userId: string, dto: CreateTodoDto): Promise<Todo> {
    const id = this.generator.generateId();

    const todo = new Todo({
      ...dto,
      id,
      user_id: userId,
      checked: false,
    });

    await this.todoRepository.saveTodo(todo);

    return todo;
  }

  async updateTodo(userId: string, todoId: string, dto: UpdateTodoDto): Promise<Todo> {
    try {
      const currentTodo = await this.todoRepository.findById(todoId);

      if (!currentTodo) {
        throw new NotFoundException();
      }

      if (currentTodo.user_id !== userId) {
        throw new ForbiddenException();
      }

      const todo = new Todo({
        ...currentTodo,
        ...dto,
      });

      await this.todoRepository.saveTodo(todo);

      return todo;
    } catch (error) {
      throw error;
    }
  }

  async toggleTodo(userId: string, todoId: string): Promise<Todo> {
    try {
      const currentTodo = await this.todoRepository.findById(todoId);

      if (!currentTodo) {
        throw new NotFoundException();
      }

      if (currentTodo.user_id !== userId) {
        throw new ForbiddenException();
      }

      const todo = new Todo({
        ...currentTodo,
        checked: !currentTodo.checked,
      });

      await this.todoRepository.saveTodo(todo);

      return currentTodo;
    } catch (error) {
      throw error;
    }
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const currentTodo = await this.todoRepository.findById(todoId);

    if (!currentTodo) {
      throw new NotFoundException();
    }

    if (currentTodo.user_id !== userId) {
      throw new ForbiddenException();
    }

    await this.todoRepository.deleteTodo(todoId);
  }
}
