import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlIsAuth } from 'src/authentication/guards/is-authenticated.guard';
import { GqlGetUser } from 'src/user/get-user.decorator';
import { CreateTodoDto } from '../dtos/create-todo.dto';

import { TodoDto } from '../dtos/todo.dto';
import { Todo } from '../entities/todo.entity';
import { TodoService } from '../service/todo.service';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private todoService: TodoService) {}

  @UseGuards(GqlIsAuth)
  @Query((returns) => [TodoDto], { name: 'todos' })
  async getAllTodos(@GqlGetUser('id') userId: string): Promise<TodoDto[]> {
    try {
      const todos = await this.todoService.getAllForUser(userId);

      return todos.map((todo: Todo) => new TodoDto(todo));
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(GqlIsAuth)
  @Mutation((returns) => TodoDto)
  async createTodo(@Args('todo') dto: CreateTodoDto, @GqlGetUser('id') userId: string): Promise<TodoDto> {
    try {
      const todo = await this.todoService.createTodoForUser(userId, dto);

      return new TodoDto(todo);
    } catch (error) {
      throw error;
    }
  }
}
