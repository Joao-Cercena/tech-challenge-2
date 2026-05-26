import { useState } from 'react';

export default function PostForm({ initialValues, onSubmit, submitLabel, busy }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [content, setContent] = useState(initialValues.content || '');
  const [author, setAuthor] = useState(initialValues.author || '');

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({ title, content, author });
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <label>
        Título
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Boas práticas em Node.js"
        />
      </label>

      <label>
        Autor
        <input
          required
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Ex.: Prof. Ana"
        />
      </label>

      <label>
        Conteúdo
        <textarea
          required
          rows={10}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escreva o conteúdo completo do post"
        />
      </label>

      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Enviando...' : submitLabel}
      </button>
    </form>
  );
}
