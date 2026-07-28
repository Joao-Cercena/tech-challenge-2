import { request } from './apiClient.js';

export function loginProfessor({ username, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}
