import { DataSource } from 'typeorm';
import { mysql } from '../config.json';

export const database = new DataSource({
  type: 'mysql',
  host: mysql.host,
  port: mysql.port,
  username: mysql.username,
  password: mysql.password,
  database: mysql.database,
  synchronize: true,
  logging: false,
  entities: [],
  subscribers: [],
  migrations: [],
});
