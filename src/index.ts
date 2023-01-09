import 'reflect-metadata';
import { compareSync } from 'bcrypt';
import express, { json } from 'express';
import { sign } from 'jsonwebtoken';
import { database } from './database';
import { logRequest } from './middleware/log';
import { authenticate } from './middleware/auth';
import users from './routes/users';
import { User } from './entity/user';
import { jwt } from '../config.json';

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

app.post('/login', async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
    select: ['id', 'email', 'password', 'permission'],
  });

  if (!user) {
    res.status(404).json({
      message: 'A user with the specified E-Mail address does not exist.',
    });
    return;
  }

  if (!compareSync(req.body.password, user.password)) {
    res.status(401).json({
      message: 'The specified password is incorrect.',
    });
    return;
  }

  const accessToken = sign(
    { id: user.id, permission: user.permission },
    jwt.accessTokenSecret
  );

  res.status(200).json({
    accessToken,
  });
});

app.listen(PORT, () => {
  console.log(`${new Date()}: Listening on port ${PORT}`);
});
