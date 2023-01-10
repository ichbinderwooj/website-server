import 'reflect-metadata';
import express, { json } from 'express';
import { database } from './database';
import { logRequest } from './middleware/log';
import { authenticate } from './middleware/auth';
import users from './routes/users';
import auth from './routes/auth';

database
  .initialize()
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });

const app = express();
const PORT = 8002;

app.use(json());
app.use(logRequest);
app.use(authenticate);

app.use('/auth', auth);
app.use('/users', users);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello world!',
  });
});

app.all('/teapot', (req, res) => {
  res.status(418).json({
    message: "I'm a teapot!",
  });
});

app.listen(PORT, () => {
  console.log(`${new Date()}: Listening on port ${PORT}`);
});
