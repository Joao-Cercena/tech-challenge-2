import { request } from './client';

export function getStudents({ page = 1, limit = 10 }, token) {
  return request(`/students?page=${page}&limit=${limit}`, { token });
}

export function getStudent(id, token) {
  return request(`/students/${id}`, { token });
}

export function createStudent(data, token) {
  return request('/students', { method: 'POST', body: data, token });
}

export function updateStudent(id, data, token) {
  return request(`/students/${id}`, { method: 'PUT', body: data, token });
}

export function deleteStudent(id, token) {
  return request(`/students/${id}`, { method: 'DELETE', token });
}
