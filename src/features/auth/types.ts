// 前端展示用的用户类型（不含敏感信息）
export interface User {
  id: string;
  username: string;
  email: string;
}

// 认证状态
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// 认证操作结果
export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}
