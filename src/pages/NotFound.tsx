import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>404 – Página no encontrada</h1>
      <p>La dirección que buscás no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}
