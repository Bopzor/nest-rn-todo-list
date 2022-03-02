import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

import { Todo } from './todo.entity';
import { TodoOrmEntity } from './todo-orm.entity';

import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoTypeOrmRepository implements TodoRepository {
  private readonly repository: Repository<TodoOrmEntity>;

  constructor(private readonly connection: Connection) {
    this.repository = connection.getRepository(TodoOrmEntity);
  }

  async findAllForUser(userId: string): Promise<Todo[]> {
    const todosOrm = await this.repository.find({ where: { user_id: userId } });

    return todosOrm.map(
      (todo) =>
        new Todo({
          ...todo,
          description: todo.description ?? undefined,
        }),
    );
  }

  async findById(todoId: string): Promise<Todo | undefined> {
    const todoOrm = await this.repository.findOne({ where: { id: todoId } });

    if (!todoOrm) {
      return;
    }

    return new Todo({
      ...todoOrm,
      description: todoOrm.description ?? undefined,
    });
  }

  async saveTodo(todo: Todo): Promise<void> {
    await this.repository.save(todo);
  }

  async deleteTodo(todoId: string): Promise<void> {
    await this.repository.delete({ id: todoId });
  }
}
