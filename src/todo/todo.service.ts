import { Injectable } from '@nestjs/common';

import { Todo } from '../entities/Todo';

import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getAllForUser(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAllForUser(userId);
  }
}
