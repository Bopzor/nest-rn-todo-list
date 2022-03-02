import { ClassProvider, FactoryProvider, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { InMemoryTodoRepository } from '../tests/in-memory-todo.repository';
import { GeneratorModule } from '../utils/generator.module';
import { TodoOrmEntity } from './todo-orm.entity';
import { TodoTypeOrmRepository } from './todo-typeorm.repository';

import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

// TODO: find a more "nest way"
const inject = [];
const imports = [];

if (process.env.NODE_ENV !== 'test') {
  imports.push(TypeOrmModule.forFeature([TodoOrmEntity]));
  inject.push(Connection);
}

export const todoRepositoryProvider: FactoryProvider<TodoRepository> = {
  provide: TodoRepository,
  inject,
  useFactory: (connection?: Connection) => {
    if (!connection) {
      return new InMemoryTodoRepository();
    }

    return new TodoTypeOrmRepository(connection);
  },
};

@Module({
  imports: [GeneratorModule],
  controllers: [TodoController],
  providers: [TodoService, todoRepositoryProvider],
})
export class TodoModule {}
