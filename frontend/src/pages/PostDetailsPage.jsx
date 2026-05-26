import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostById } from '../api/postsApi.js';

export default function PostDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError('');
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Falha ao carregar o post.');
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [id]);

  if (loading) {
    return <p className="feedback">Carregando post...</p>;
  }

  if (error) {
    return <p className="feedback error">{error}</p>;
  }

  return (
    <article className="panel article">
      <h1>{post.title}</h1>
      <p className="muted">Por {post.author}</p>
      <div className="divider" />
      <p className="content-text">{post.content}</p>

      <div className="action-row">
        <Link className="btn btn-muted" to="/">
          Voltar
        </Link>
        <Link className="btn" to={`/posts/${post.id}/edit`}>
          Editar
        </Link>
      </div>
    </article>
  );
}
