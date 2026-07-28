import { request } from './client';

export function getPosts() {
  return request('/posts');
}

export function searchPosts(query) {
  return request(`/posts/search?q=${encodeURIComponent(query)}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function createPost(data, token) {
  return request('/posts', { method: 'POST', body: data, token });
}

export function updatePost(id, data, token) {
  return request(`/posts/${id}`, { method: 'PUT', body: data, token });
}

export function deletePost(id, token) {
  return request(`/posts/${id}`, { method: 'DELETE', token });
}
