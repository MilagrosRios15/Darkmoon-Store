import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { EMAIL_PATTERN, getRedirectPath } from '../utils/auth';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectPath(location.state);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = 'Crear cuenta | DarkMoon Store';

    return () => {
      document.title = 'DarkMoon Store';
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    // Las mismas reglas que valida el backend, con mensajes claros.
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      setError('Ingresá tu nombre (mínimo 2 caracteres).');
      return;
    }
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setError('Ingresá un email válido, por ejemplo nombre@ejemplo.com.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError(null);
    setSending(true);
    try {
      await register(cleanName, cleanEmail, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'No pudimos crear tu cuenta. Intentá de nuevo.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>

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
              Creá tu cuenta para comprar en DarkMoon Store.
            </p>

            <form
              className="auth-form"
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              noValidate
            >
              <div className="form-field">
                <label htmlFor="register-name">Nombre</label>
                <input
                  id="register-name"
                  className="auth-input"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  maxLength={120}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-password">Contraseña</label>
                <input
                  id="register-password"
                  className="auth-input"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-confirm">Repetí la contraseña</label>
                <input
                  id="register-confirm"
                  className="auth-input"
                  type="password"
                  autoComplete="new-password"
                  maxLength={128}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
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
                {sending ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="auth-switch">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" state={location.state}>
                Iniciá sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}