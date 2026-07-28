import { loginProfessor } from '../services/auth.service.js';
import { HttpError } from '../utils/http-error.js';

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password.trim()) {
      throw new HttpError(400, 'username e password são obrigatórios');
    }

    const result = await loginProfessor({ username: username.trim(), password });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
