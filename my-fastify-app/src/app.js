import fastify from 'fastify';

import { registerPlugins } from './plugins/index.js';
import { setRoutes } from './routes/index.js';


const app = fastify({ logger: true });

// Register CORS plugin
await app.register(import('@fastify/cors'), {
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000'], // Allow frontend origins
  credentials: true
});

registerPlugins(app);
setRoutes(app);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();