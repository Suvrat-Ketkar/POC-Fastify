import { registerNoteRoutes } from '../notes-app/notes-app.routes.js';

export const setRoutes = (app) => {
    app.get('/', async (request, reply) => {
        return { message: 'Welcome to my Fastify app!' };
    });

    app.get('/health', async (request, reply) => {
        return { status: 'ok' };
    });

    // Register note routes
    registerNoteRoutes(app);
};