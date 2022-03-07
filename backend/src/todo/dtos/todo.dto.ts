import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { ITodoDto } from 'todo-shared';

import { Todo } from '../entities/todo.entity';

@ObjectType()
export class TodoDto implements ITodoDto {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field((type) => String, { nullable: true })
  description: string | undefined;

  @Field()
  checked!: boolean;

  @Exclude()
  user_id!: string;

  constructor(todo: Todo) {
    Object.assign(this, todo);
  }
}
