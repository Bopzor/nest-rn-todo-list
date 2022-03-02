import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IdColumn } from '../typeorm/id-colum-typeorm.decorator';

@Entity({ name: 'todo' })
export class TodoOrmEntity {
  @PrimaryColumn()
  id!: string;

  @IdColumn()
  _id?: string | null;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'boolean' })
  checked!: boolean;

  @Column()
  user_id!: string;

  constructor(props: Partial<TodoOrmEntity>) {
    Object.assign(this, props);
  }
}
