import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { IsAuth } from 'src/authentication/guards/is-authenticated.guard';
import { GetUser } from 'src/user/get-user.decorator';

import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { TodoDto } from '../dtos/todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { TodoService } from '../service/todo.service';

@Controller('todos')
@UseInterceptors(ClassSerializerInterceptor)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(IsAuth)
  @Get()
  async getAllTodos(@GetUser('id') userId: string): Promise<TodoDto[]> {
    try {
      const todos = await this.todoService.getAllForUser(userId);

      return todos.map((todo: Todo) => new TodoDto(todo));
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsAuth)
  @Post()
  async createTodo(@GetUser('id') userId: string, @Body() dto: CreateTodoDto): Promise<TodoDto> {
    try {
      const todo = await this.todoService.createTodoForUser(userId, dto);

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

  @UseGuards(IsAuth)
  @Patch('/:id/toggle')
  @HttpCode(HttpStatus.OK)
  async toggleTodo(@GetUser('id') userId: string, @Param('id') todoId: string): Promise<TodoDto> {
    try {
      const todo = await this.todoService.toggleTodo(userId, todoId);

      return new TodoDto(todo);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(IsAuth)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTodo(@GetUser('id') userId: string, @Param('id') todoId: string): Promise<void> {
    try {
      await this.todoService.deleteTodo(userId, todoId);
    } catch (error) {
      throw error;
    }
  }
}
