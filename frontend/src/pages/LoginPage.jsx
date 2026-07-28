import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const targetPath = location.state?.from || '/admin';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await login({ username, password });
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Não foi possível autenticar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="panel auth-box">
        <h1>Login professor</h1>
        <p className="muted">Acesso às páginas de criação, edição e administração.</p>

        {error ? <p className="feedback error">{error}</p> : null}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Usuário
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="professor"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="******"
              required
            />
          </label>

          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  );
}
