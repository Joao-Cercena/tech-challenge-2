import { request } from './client';

export function getProfessors({ page = 1, limit = 10 }, token) {
  return request(`/professors?page=${page}&limit=${limit}`, { token });
}

export function getProfessor(id, token) {
  return request(`/professors/${id}`, { token });
}

export function createProfessor(data, token) {
  return request('/professors', { method: 'POST', body: data, token });
}

export function updateProfessor(id, data, token) {
  return request(`/professors/${id}`, { method: 'PUT', body: data, token });
}

export function deleteProfessor(id, token) {
  return request(`/professors/${id}`, { method: 'DELETE', token });
}
