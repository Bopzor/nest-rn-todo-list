import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ICreateTodoDto } from 'todo-shared';

@InputType()
export class CreateTodoDto implements ICreateTodoDto {
  @Field()
  @IsNotEmpty()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}
