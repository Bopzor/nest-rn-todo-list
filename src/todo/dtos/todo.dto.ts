import { IsNotEmpty } from 'class-validator';

import { Todo } from 'entities/Todo';

export class TodoDto {
  constructor(todo: Todo) {
    Object.assign(this, todo);
  }

  @IsNotEmpty()
  title!: string;

  description: string | undefined;

  @IsNotEmpty()
  checked!: boolean;
}
