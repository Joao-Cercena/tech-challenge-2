const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const raw = await response.text();
  const body = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    throw new Error(body?.error || 'Falha ao processar requisição.');
  }

  return body;
}

export function getPosts() {
  return request('/posts');
}

export function searchPosts(query) {
  return request(`/posts/search?q=${encodeURIComponent(query)}`);
}

export function getPostById(id) {
  return request(`/posts/${id}`);
}

export function createPost(payload) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updatePost(id, payload) {
  return request(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deletePost(id) {
  return request(`/posts/${id}`, {
    method: 'DELETE'
  });
}
