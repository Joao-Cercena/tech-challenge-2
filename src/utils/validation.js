import { HttpError } from './http-error.js';

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${field} é obrigatório`);
  }

  return value.trim();
}

export function validateProfessorCreate(body) {
  return {
    name: requiredString(body.name, 'name'),
    username: requiredString(body.username, 'username'),
    password: requiredString(body.password, 'password')
  };
}

export function validateProfessorUpdate(body) {
  const data = {};

  for (const field of ['name', 'username', 'password']) {
    if (body[field] !== undefined) {
      data[field] = requiredString(body[field], field);
    }
  }

  if (!Object.keys(data).length) {
    throw new HttpError(400, 'Informe ao menos um campo para atualização');
  }

  return data;
}

export function validateStudentCreate(body) {
  return {
    name: requiredString(body.name, 'name'),
    username: requiredString(body.username, 'username')
  };
}

export function validateStudentUpdate(body) {
  const data = {};

  for (const field of ['name', 'username']) {
    if (body[field] !== undefined) {
      data[field] = requiredString(body[field], field);
    }
  }

  if (!Object.keys(data).length) {
    throw new HttpError(400, 'Informe ao menos um campo para atualização');
  }

  return data;
}

export function parseId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new HttpError(400, 'ID inválido');
  }

  return parsedId;
}
