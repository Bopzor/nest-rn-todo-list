import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (process.env.DB_TYPE) {
      case 'mongodb':
        return {
          type: 'mongodb',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_POST ?? '27017'),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          logging: true,
          ssl: process.env.SSL === 'true' ? true : false,
          authSource: process.env.DB_AUTH_SOURCE,
          entities: ['dist/**/*.entity{.ts,.js}'],
        };

      case 'sqlite':
      default:
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          synchronize: true,
          logging: true,
          entities: ['dist/**/*.entity{.ts,.js}'],
        };
    }
  }
}
