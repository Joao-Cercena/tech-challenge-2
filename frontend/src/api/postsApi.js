import { request } from './apiClient.js';

export function getPosts() {
  return request('/posts');
}

export function searchPosts(query) {
  return request(`/posts/search?q=${encodeURIComponent(query)}`);
}

export function getPostById(id) {
  return request(`/posts/${id}`);
}

export function createPost(payload, token) {
  return request('/posts', {
    method: 'POST',
    authToken: token,
    body: JSON.stringify(payload)
  });
}

export function updatePost(id, payload, token) {
  return request(`/posts/${id}`, {
    method: 'PUT',
    authToken: token,
    body: JSON.stringify(payload)
  });
}

export function deletePost(id, token) {
  return request(`/posts/${id}`, {
    method: 'DELETE',
    authToken: token
  });
}
