import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'tech_challenge_auth';

const AuthContext = createContext(null);

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
      login: ({ username, password }) => {
        const expectedUser = import.meta.env.VITE_PROFESSOR_USER || 'professor';
        const expectedPassword = import.meta.env.VITE_PROFESSOR_PASSWORD || '123456';

        if (username !== expectedUser || password !== expectedPassword) {
          throw new Error('Credenciais inválidas. Verifique usuário e senha.');
        }

        const authUser = {
          username,
          role: 'professor'
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        setUser(authUser);
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      }
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }

  return ctx;
}
