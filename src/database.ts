import { DataSource } from 'typeorm';
import { createClient } from 'redis';
import { User } from './entity/user';
import { UserMigration } from './migration/user-migration';
import { mysql, redis } from '../config.json';

export const database = new DataSource({
  type: 'mysql',
  host: mysql.host,
  port: mysql.port,
  username: mysql.username,
  password: mysql.password,
  database: mysql.database,
  synchronize: false,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [UserMigration],
});

export const redisDB = createClient({
  url: `redis://${redis.username}:${redis.password}@${redis.host}:${redis.port}`,
});
