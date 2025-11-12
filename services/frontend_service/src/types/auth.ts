export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserRole {
  role: 'admin' | 'gestor' | 'user';
}

export interface JWTPayload {
  email: string;
  role: string;
  exp: number;
  iat: number;
}
