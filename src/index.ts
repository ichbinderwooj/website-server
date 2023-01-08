import express from 'express';

const app = express();
const PORT = 8002;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
