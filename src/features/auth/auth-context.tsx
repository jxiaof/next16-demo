"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, AuthState } from "./types";
import { getCurrentUser } from "./actions";

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 从服务器获取当前用户状态
  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: !!user,
      });
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setAuthState({ user: null, isAuthenticated: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始化时获取用户状态
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 登录（更新本地状态）
  const login = useCallback((user: User) => {
    setAuthState({ user, isAuthenticated: true });
  }, []);

  // 登出（清除本地状态）
  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        refreshUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
