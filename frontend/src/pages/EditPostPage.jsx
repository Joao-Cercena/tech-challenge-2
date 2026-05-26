import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm.jsx';
import { getPostById, updatePost } from '../api/postsApi.js';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError('');
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Falha ao carregar post para edição.');
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [id]);

  async function handleSubmit(payload) {
    setBusy(true);
    setError('');

    try {
      await updatePost(id, payload);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar as alterações.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="feedback">Carregando dados para edição...</p>;
  }

  if (!post) {
    return <p className="feedback error">{error || 'Post não encontrado.'}</p>;
  }

  return (
    <section>
      <h1>Editar postagem</h1>
      <p className="muted">Atualize o conteúdo e salve as alterações.</p>

      {error ? <p className="feedback error">{error}</p> : null}

      <PostForm
        initialValues={{ title: post.title, content: post.content, author: post.author }}
        onSubmit={handleSubmit}
        submitLabel="Salvar alterações"
        busy={busy}
      />
    </section>
  );
}
