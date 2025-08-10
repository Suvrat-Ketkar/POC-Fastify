import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (request, reply) => {
  const { email, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await request.server.prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return { token };
  } catch (error) {
    if (error.code === 'P2002') {
      reply.code(400).send({ error: 'Email already exists' });
    }
    throw error;
  }
};

export const login = async (request, reply) => {
  const { email, password } = request.body;

  const user = await request.server.prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    reply.code(401).send({ error: 'Invalid credentials' });
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    reply.code(401).send({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  return { token };
};
