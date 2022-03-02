import { Column, ColumnOptions, ObjectIdColumn } from 'typeorm';

export function IdColumn(options?: ColumnOptions): PropertyDecorator {
  if (process.env.DB_TYPE === 'mongodb') {
    return ObjectIdColumn(options);
  }

  return Column({ ...options, type: 'text', nullable: true });
}
