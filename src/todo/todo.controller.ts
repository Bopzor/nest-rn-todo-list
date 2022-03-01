import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Todo } from '../entities/Todo';
import { User } from '../entities/User';
import { IsAuth } from '../authentication/guards/is-authenticated.guard';
import { GetUser } from '../user/get-user.decorator';

import { TodoDto } from './dtos/todo.dto';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(IsAuth)
  @Get()
  async getAllTodos(@GetUser() user: User): Promise<TodoDto[]> {
    try {
      const todos = await this.todoService.getAllForUser(user.id);

      return todos.map((todo: Todo) => new TodoDto(todo));
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsAuth)
  @Post()
  async createTodo(@GetUser() user: User, @Body() dto: CreateTodoDto): Promise<TodoDto> {
    try {
      const todo = await this.todoService.createTodoForUser(user.id, dto);

      return new TodoDto(todo);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsAuth)
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateTodo(
    @GetUser('id') userId: string,
    @Param('id') todoId: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoDto> {
    try {
      const todo = await this.todoService.updateTodo(userId, todoId, dto);

      return new TodoDto(todo);
    } catch (error) {
      throw error;
    }
  }
}
