import { Exclude } from 'class-transformer';

import { Todo } from '../../entities/Todo';

export class TodoDto {
  constructor(todo: Todo) {
    Object.assign(this, todo);
  }

  title!: string;

  description: string | undefined;

  checked!: boolean;

  @Exclude()
  user_id!: string;
}
