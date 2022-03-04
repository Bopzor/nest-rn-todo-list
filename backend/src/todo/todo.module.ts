import { FactoryProvider, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { InMemoryTodoRepository } from 'src/tests/in-memory-todo.repository';
import { GeneratorModule } from 'src/utils/generator.module';

import { TodoController } from './controller/todo.controller';
import { TodoOrmEntity } from './entities/todo-orm.entity';
import { TodoTypeOrmRepository } from './repositories/todo-typeorm.repository';
import { TodoRepository } from './repositories/todo.repository';
import { TodoService } from './service/todo.service';

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
