import { InputType, Field } from '@nestjs/graphql';
import { IUpdateTodoDto } from 'todo-shared';

@InputType()
export class UpdateTodoDto implements IUpdateTodoDto {
  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  description?: string;
}
