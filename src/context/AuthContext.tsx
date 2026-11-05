import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ApiError,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  checking: boolean; // true mientras se verifica la sesión guardada
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  expireSession: () => void; // se usa cuando el backend dice que la sesión venció
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clave con la que se guarda el token en el navegador.
const TOKEN_KEY = 'darkmoon-token';

function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string | null) {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Si el navegador no permite guardar, la sesión dura hasta recargar.
  }
}

interface SessionState {
  token: string;
  user: User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(null);
  // Token guardado de una visita anterior, pendiente de verificar.
  const [pendingToken, setPendingToken] = useState<string | null>(readStoredToken);

  // Al abrir la página: si había un token guardado, se le pregunta al
  // backend si sigue siendo válido y de qué usuario es.
  useEffect(() => {
    if (pendingToken === null) return;

    const controller = new AbortController();

    getCurrentUser(pendingToken, controller.signal)
      .then((user) => {
        if (controller.signal.aborted) return;
        setSession({ token: pendingToken, user });
        setPendingToken(null);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // 401: la sesión ya no es válida, se borra.
        if (error instanceof ApiError && error.status === 401) {
          storeToken(null);
        }
        setPendingToken(null);
      });

    return () => controller.abort();
  }, [pendingToken]);

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    storeToken(result.token);
    setSession({ token: result.token, user: result.user });
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await registerUser(name, email, password);
    storeToken(result.token);
    setSession({ token: result.token, user: result.user });
  };

  const logout = async () => {
    const current = session;
    setSession(null);
    storeToken(null);
    if (current) {
      try {
        await logoutUser(current.token);
      } catch {
        // Aunque falle el aviso al backend, en el navegador ya se cerró.
      }
    }
  };

  const expireSession = () => {
    setSession(null);
    storeToken(null);
  };

  const value: AuthContextType = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    checking: pendingToken !== null,
    login,
    register,
    logout,
    expireSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}