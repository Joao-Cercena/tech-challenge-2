import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm.jsx';
import { createPost } from '../api/postsApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { token } = useAuth();

  async function handleSubmit(payload) {
    setBusy(true);
    setError('');

    try {
      const post = await createPost(payload, token);
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(err.message || 'Falha ao criar post.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h1>Criar nova postagem</h1>
      <p className="muted">Preencha os campos e publique.</p>

      {error ? <p className="feedback error">{error}</p> : null}

      <PostForm
        initialValues={{ title: '', content: '', author: '' }}
        onSubmit={handleSubmit}
        submitLabel="Publicar"
        busy={busy}
      />
    </section>
  );
}
