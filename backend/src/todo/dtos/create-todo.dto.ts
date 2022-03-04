import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTodoDto {
  @Field()
  @IsNotEmpty()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}
