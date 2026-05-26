import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePost, getPosts } from '../api/postsApi.js';

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPosts() {
    setLoading(true);
    setError('');

    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Falha ao carregar posts para administração.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este post?');
    if (!confirmDelete) {
      return;
    }

    try {
      await deletePost(id);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      setError(err.message || 'Não foi possível excluir o post.');
    }
  }

  return (
    <section>
      <h1>Painel administrativo</h1>
      <p className="muted">Edite ou exclua conteúdos publicados.</p>

      {loading ? <p className="feedback">Carregando...</p> : null}
      {error ? <p className="feedback error">{error}</p> : null}

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td className="action-row">
                  <Link className="btn btn-muted" to={`/posts/${post.id}`}>
                    Ler
                  </Link>
                  <Link className="btn" to={`/posts/${post.id}/edit`}>
                    Editar
                  </Link>
                  <button className="btn btn-danger" type="button" onClick={() => handleDelete(post.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
