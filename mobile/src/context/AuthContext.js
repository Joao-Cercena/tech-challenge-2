import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loginProfessor } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';

const SESSION_KEY = 'tech_challenge_session';
const AuthContext = createContext(null);

function decodeBase64Url(value) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  let buffer = 0;
  let bits = 0;
  let decoded = '';

  for (const character of base64) {
    if (character === '=') {
      break;
    }

    const index = alphabet.indexOf(character);
    if (index < 0) {
      throw new Error('Base64 inválido');
    }

    buffer = (buffer << 6) | index;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      decoded += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  return decoded;
}

function hasActiveProfessorToken(token) {
  try {
    const payloadPart = token.split('.')[1];
    const payload = JSON.parse(decodeBase64Url(payloadPart));

    return payload.role === 'professor' && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function toSession(response, { requireActiveToken = false } = {}) {
  if (!response?.token || !response?.professor?.id || !response.professor.username) {
    throw new Error('Resposta de autenticação inválida. Tente novamente.');
  }

  if (requireActiveToken && !hasActiveProfessorToken(response.token)) {
    throw new Error('Sessão inválida ou expirada.');
  }

  return {
    token: response.token,
    professor: {
      id: response.professor.id,
      username: response.professor.username
    }
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const sessionRef = useRef(null);

  const logout = useCallback(async () => {
    sessionRef.current = null;
    setSession(null);
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }, []);

  const invalidateRejectedSession = useCallback(async (rejectedToken) => {
    if (rejectedToken && sessionRef.current?.token === rejectedToken) {
      await logout();
    }
  }, [logout]);

  useEffect(() => {
    setUnauthorizedHandler(invalidateRejectedSession);

    return () => setUnauthorizedHandler(null);
  }, [invalidateRejectedSession]);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const storedSession = await SecureStore.getItemAsync(SESSION_KEY);

        if (storedSession) {
          const parsedSession = toSession(JSON.parse(storedSession), { requireActiveToken: true });
          if (active) {
            sessionRef.current = parsedSession;
            setSession(parsedSession);
          }
        }
      } catch {
        await SecureStore.deleteItemAsync(SESSION_KEY);
      } finally {
        if (active) {
          setIsRestoring(false);
        }
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await loginProfessor(credentials);
    const nextSession = toSession(response);

    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(nextSession));
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  const value = useMemo(() => ({
    token: session?.token || null,
    professor: session?.professor || null,
    isAuthenticated: Boolean(session?.token && session?.professor),
    isRestoring,
    login,
    logout
  }), [isRestoring, login, logout, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
