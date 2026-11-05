import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { EMAIL_PATTERN, getRedirectPath } from '../utils/auth';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectPath(location.state);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = 'Iniciar sesión | DarkMoon Store';

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    // Validaciones antes de enviar.
    const cleanEmail = email.trim();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setError('Ingresá un email válido, por ejemplo nombre@ejemplo.com.');
      return;
    }
    if (password === '') {
      setError('Ingresá tu contraseña.');
      return;
    }

    setError(null);
    setSending(true);
    try {
      await login(cleanEmail, password);
      // Vuelve a donde estaba (por ejemplo, el carrito) o al inicio.
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos iniciar sesión. Intentá de nuevo.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>

        {user ? (
          <>
            <p className="auth-subtitle">
              Ya iniciaste sesión como <strong>{user.name}</strong>.
            </p>
            <Link to={redirectTo} className="btn btn-primary auth-submit">
              Continuar
            </Link>
          </>
        ) : (
          <>
            <p className="auth-subtitle">
              Ingresá con tu cuenta para finalizar tus compras.
            </p>

            <form
              className="auth-form"
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              noValidate
            >
              <div className="form-field">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="login-password">Contraseña</label>
                <input
                  id="login-password"
                  className="auth-input"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error && (
                <p className="feedback error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={sending}
              >
                {sending ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="auth-switch">
              ¿No tenés cuenta?{' '}
              <Link to="/register" state={location.state}>
                Creá una
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}