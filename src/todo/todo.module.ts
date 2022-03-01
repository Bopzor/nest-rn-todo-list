import { ClassProvider, Module } from '@nestjs/common';

import { InMemoryTodoRepository } from '../tests/in-memory-todo.repository';
import { GeneratorModule } from '../utils/generator.module';

import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

export const todoRepositoryProvider: ClassProvider<TodoRepository> = {
  provide: TodoRepository,
  useClass: InMemoryTodoRepository,
};

@Module({
  imports: [GeneratorModule],
  controllers: [TodoController],
  providers: [TodoService, todoRepositoryProvider],
})
export class TodoModule {}
