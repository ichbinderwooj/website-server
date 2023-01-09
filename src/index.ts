import express from 'express';
import { database } from './database';
import { logRequest } from './middleware/log';

database
  .initialize()
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });

const app = express();
const PORT = 8002;

app.use(logRequest);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(PORT, () => {
  console.log(`${new Date()}: Listening on port ${PORT}`);
});
