import { register, login } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schema.js';

export default async function (fastify, opts) {
  fastify.post('/auth/register', { schema: registerSchema }, register);
  fastify.post('/auth/login', { schema: loginSchema }, login);
}
