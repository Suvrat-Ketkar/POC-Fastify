import noteRoutes from '../notes-app/notes-app.routes.js';
import authRoutes from '../auth/auth.routes.js';

export const setRoutes = async (app) => {
    app.get('/', async (request, reply) => {
        return { message: 'Welcome to my Fastify app!' };
    });

    app.get('/health', async (request, reply) => {
        return { status: 'ok' };
    });

    // Register auth routes first
    await app.register(authRoutes);

    // Register note routes after auth is set up
    await app.register(noteRoutes);
};