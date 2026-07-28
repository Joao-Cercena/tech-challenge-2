import jwt from 'jsonwebtoken';
import { verifyProfessorToken } from '../services/auth.service.js';

export function authenticateProfessor(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação obrigatório' });
  }

  const token = authorization.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação obrigatório' });
  }

  try {
    const payload = verifyProfessorToken(token);
    req.professor = { id: Number(payload.sub), username: payload.username };
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError || error.statusCode === 401) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    return next(error);
  }
}
