import { HttpError } from './http-error.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function getPagination(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? DEFAULT_LIMIT);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new HttpError(400, `Paginação inválida. Use page >= 1 e limit entre 1 e ${MAX_LIMIT}`);
  }

  return { page, limit, skip: (page - 1) * limit };
}

export function paginatedResponse(data, { page, limit }, total) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
