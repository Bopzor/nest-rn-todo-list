import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserOrmEntity {
  @PrimaryColumn({ name: '_id' })
  id!: string;

  @Column()
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
