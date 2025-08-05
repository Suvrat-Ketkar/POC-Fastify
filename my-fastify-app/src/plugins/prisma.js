// plugins/prisma.js
import fp from 'fastify-plugin';
import { PrismaClient } from '../generated/prisma/index.js';

export default fp(async (fastify, opts) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});
