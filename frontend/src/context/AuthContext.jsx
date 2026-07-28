import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loginProfessor } from '../api/authApi.js';
import { setUnauthorizedHandler } from '../api/apiClient.js';

const STORAGE_KEY = 'tech_challenge_auth';

const AuthContext = createContext(null);

function hasActiveProfessorToken(token) {
  try {
    const payloadPart = token.split('.')[1];
    const base64Payload = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, '=')));

    return payload.role === 'professor' && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw);

    if (!session?.token || !session?.professor?.id || !session.professor.username || !hasActiveProfessorToken(session.token)) {
      throw new Error('Sessão inválida');
    }

    return session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  setUnauthorizedHandler(logout);

  useEffect(() => {
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo(() => {
    return {
      user: session?.professor || null,
      token: session?.token || null,
      isAuthenticated: Boolean(session?.token && session?.professor),
      login: async ({ username, password }) => {
        const response = await loginProfessor({ username, password });

        if (!response?.token || !response?.professor?.id || !response.professor.username) {
          throw new Error('Resposta de autenticação inválida. Tente novamente.');
        }

        const nextSession = {
          token: response.token,
          professor: {
            id: response.professor.id,
            username: response.professor.username
          }
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      },
      logout
    };
  }, [logout, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }

  return ctx;
}
