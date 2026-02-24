import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; newPassword?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "pg_reformas_users";
const SESSION_KEY = "pg_reformas_session";

interface StoredUser {
  email: string;
  passwordHash: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser({ email: parsed.email });
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const foundUser = users.find(u => u.email === trimmedEmail);

    if (!foundUser) {
      return { success: false, error: "Usuário não encontrado" };
    }

    if (foundUser.passwordHash !== simpleHash(password)) {
      return { success: false, error: "Senha incorreta" };
    }

    const session = { email: trimmedEmail };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser({ email: trimmedEmail });
    return { success: true };
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !password) {
      return { success: false, error: "Preencha todos os campos" };
    }

    if (password.length < 6) {
      return { success: false, error: "A senha deve ter pelo menos 6 caracteres" };
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email === trimmedEmail);

    if (existingUser) {
      return { success: false, error: "Este email já está cadastrado" };
    }

    const newUser: StoredUser = {
      email: trimmedEmail,
      passwordHash: simpleHash(password),
    };

    users.push(newUser);
    saveUsers(users);

    const session = { email: trimmedEmail };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser({ email: trimmedEmail });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string; newPassword?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === trimmedEmail);

    if (userIndex === -1) {
      return { success: false, error: "Email não encontrado" };
    }

    // Generate a temporary password
    const newPassword = Math.random().toString(36).slice(-8);
    users[userIndex].passwordHash = simpleHash(newPassword);
    saveUsers(users);

    return { success: true, newPassword };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
