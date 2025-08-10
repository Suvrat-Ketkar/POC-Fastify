import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default fp(async function (fastify, opts) {
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        reply.code(401).send({ error: 'No token provided' });
        return reply;
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      request.user = { ...decoded };
    } catch (err) {
      reply.code(401).send({ error: 'Authentication failed' });
      return reply;
    }
  });
});
