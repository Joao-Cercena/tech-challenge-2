import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="shell">
      <div className="bg-glow bg-glow-a" />
      <div className="bg-glow bg-glow-b" />

      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">TC</span>
          <span>Tech Challenge</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Posts</NavLink>
          {isAuthenticated ? <NavLink to="/posts/new">Nova postagem</NavLink> : null}
          {isAuthenticated ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>

        <div className="auth-area">
          {isAuthenticated ? (
            <>
              <span className="tag">{user.username}</span>
              <button type="button" className="btn btn-muted" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <NavLink className="btn" to="/login">
              Login professor
            </NavLink>
          )}
        </div>
      </header>

      <main className="content page-enter">{children}</main>
    </div>
  );
}
