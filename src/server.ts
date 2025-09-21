import express from 'express';
import { MemoryStore } from './rateLimiter/memoryStore.js';
import { rateLimiter } from './rateLimiter/middleware.js';

const app = express();
const PORT = 3000;


const store = new MemoryStore();
const limiter = rateLimiter(store, {
  limit: 5,
  windowMs: 60_000,
  prefix: 'rl:v1'
});

app.use(limiter);

app.get('/api/shorten', (req, res) => {
  res.json({ ok: true, msg: "you are within the limits." });
})

app.get('/', (req, res) => {
  res.send('Hello!')
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
});
