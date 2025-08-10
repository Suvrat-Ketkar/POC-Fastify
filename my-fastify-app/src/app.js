import fastify from 'fastify';
import { registerPlugins } from './plugins/index.js';
import { setRoutes } from './routes/index.js';

const app = fastify({ logger: true });

const bootstrap = async () => {
  // Register CORS plugin
  await app.register(import('@fastify/cors'), {
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'], // Allow frontend origins
    credentials: true
  });

  // Register plugins first
  await registerPlugins(app);

  // Then set up routes
  setRoutes(app);
};

const start = async () => {
  try {
    await bootstrap();
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();