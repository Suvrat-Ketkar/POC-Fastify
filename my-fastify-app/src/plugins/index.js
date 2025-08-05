import prisma from './prisma.js'
export async function registerPlugins(fastify) {
    // Register your plugins here
    fastify.register(prisma);
}