// 用户类型
export interface User {
  id: string;
  username: string;
  email?: string;
}

// 认证状态
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
