import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, searchPosts } from '../api/postsApi.js';

function excerpt(text, limit = 120) {
  if (!text) {
    return '';
  }
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPosts(search = '') {
    setLoading(true);
    setError('');

    try {
      const data = search.trim() ? await searchPosts(search) : await getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    await loadPosts(query);
  }

  return (
    <section className="home-page">
      <div className="hero panel">
        <h1>Tech challenge Full Stack - 3</h1>
      </div>

      <form className="panel search" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por palavra-chave"
        />
        <button className="btn" type="submit">
          Buscar
        </button>
      </form>

      {loading ? <p className="feedback">Carregando posts...</p> : null}
      {error ? <p className="feedback error">{error}</p> : null}

      {!loading && !error ? (
        <div className="posts-grid stagger">
          {posts.map((post, index) => (
            <article key={post.id} className="panel card" style={{ '--i': index }}>
              <h2>{post.title}</h2>
              <p className="muted">Por {post.author}</p>
              <p>{excerpt(post.content)}</p>
              <Link className="inline-link" to={`/posts/${post.id}`}>
                Ler post
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
