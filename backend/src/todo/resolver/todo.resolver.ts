import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlIsAuth } from 'src/authentication/guards/is-authenticated.guard';
import { GqlGetUser } from 'src/user/get-user.decorator';
import { CreateTodoDto } from '../dtos/create-todo.dto';

import { TodoDto } from '../dtos/todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
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

  @UseGuards(GqlIsAuth)
  @Mutation((returns) => TodoDto)
  async updateTodo(
    @Args('id') todoId: string,
    @Args('todo') dto: UpdateTodoDto,
    @GqlGetUser('id') userId: string,
  ): Promise<TodoDto> {
    try {
      const todo = await this.todoService.updateTodo(userId, todoId, dto);

      return new TodoDto(todo);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(GqlIsAuth)
  @Mutation((returns) => TodoDto)
  async toggleTodo(@Args('id') todoId: string, @GqlGetUser('id') userId: string): Promise<TodoDto> {
    try {
      const todo = await this.todoService.toggleTodo(userId, todoId);

      return new TodoDto(todo);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(GqlIsAuth)
  @Mutation((returns) => String)
  async deleteTodo(@Args('id') todoId: string, @GqlGetUser('id') userId: string): Promise<String> {
    try {
      await this.todoService.deleteTodo(userId, todoId);

      return todoId;
    } catch (error) {
      throw error;
    }
  }
}
