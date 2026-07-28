import { request } from './client';

export function loginProfessor({ username, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: { username, password }
  });
}
