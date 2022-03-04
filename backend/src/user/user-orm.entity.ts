import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IdColumn } from '../typeorm/id-colum-typeorm.decorator';

@Entity({ name: 'user' })
export class UserOrmEntity {
  @PrimaryColumn()
  id!: string;

  @IdColumn()
  _id?: string | null;

  @Column({ unique: true })
  username!: string;

  @Column()
  hashedPassword!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'text', nullable: true })
  token!: string | null;

  constructor(props: Partial<UserOrmEntity>) {
    Object.assign(this, props);
  }
}
