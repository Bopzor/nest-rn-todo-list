import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateTodoDto {
  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  description?: string;
}
