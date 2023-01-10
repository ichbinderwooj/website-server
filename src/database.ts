import { DataSource } from 'typeorm';
import { User } from './entity/user';
import { UserMigration } from './migration/user-migration';
import { mysql } from '../config.json';

export const database = new DataSource({
  type: 'mysql',
  host: mysql.host,
  port: mysql.port,
  username: mysql.username,
  password: mysql.password,
  database: mysql.database,
  synchronize: false,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [UserMigration],
});
