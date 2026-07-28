import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database.js';
import { HttpError } from '../utils/http-error.js';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new HttpError(500, 'Configuração de autenticação ausente');
  }

  return process.env.JWT_SECRET;
}

export async function loginProfessor({ username, password }) {
  const professor = await prisma.professor.findUnique({ where: { username } });

  if (!professor || !(await bcrypt.compare(password, professor.password))) {
    throw new HttpError(401, 'Credenciais inválidas');
  }

  const publicProfessor = {
    id: professor.id,
    name: professor.name,
    username: professor.username
  };

  const token = jwt.sign(
    { role: 'professor', username: professor.username },
    getJwtSecret(),
    { subject: String(professor.id), expiresIn: '8h' }
  );

  return { token, professor: publicProfessor };
}

export function verifyProfessorToken(token) {
  const payload = jwt.verify(token, getJwtSecret());

  if (payload.role !== 'professor' || !payload.sub) {
    throw new HttpError(401, 'Token inválido');
  }

  return payload;
}
