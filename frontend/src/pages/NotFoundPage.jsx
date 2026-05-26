import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="panel">
      <h1>Página não encontrada</h1>
      <p className="muted">Esse endereço não existe na aplicação.</p>
      <Link className="btn" to="/">
        Voltar para início
      </Link>
    </section>
  );
}
