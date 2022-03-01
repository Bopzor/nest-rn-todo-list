import { Injectable } from '@nestjs/common';

import { GeneratorPort } from '../utils/generator.port';
import { Todo } from '../entities/Todo';

import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoRepository } from './todo.repository';

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
}
