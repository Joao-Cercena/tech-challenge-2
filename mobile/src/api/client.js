const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

let unauthorizedHandler = null;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

async function parseResponse(response) {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function request(path, { method = 'GET', token, body } = {}) {
  if (!configuredApiUrl) {
    throw new ApiError('Configure EXPO_PUBLIC_API_URL para conectar o aplicativo à API.');
  }

  let response;

  try {
    response = await fetch(`${configuredApiUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
  } catch {
    throw new ApiError('Não foi possível conectar à API. Verifique a configuração e a rede.');
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && token) {
      await unauthorizedHandler?.(token);
    }

    throw new ApiError(data?.error || 'Não foi possível processar a solicitação.', response.status);
  }

  return data;
}
