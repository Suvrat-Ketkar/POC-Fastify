import prisma from './prisma.js';
import auth from './auth.js';

export async function registerPlugins(fastify) {
    // Register your plugins here
    await fastify.register(prisma);
    await fastify.register(auth);
}