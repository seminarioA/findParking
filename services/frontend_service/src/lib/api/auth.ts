import type { LoginCredentials, AuthResponse, UserRole, RegisterData } from '@/types/auth';

const API_BASE = '/api/auth';

export async function login(credentials: LoginCredentials): Promise<string> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const data: AuthResponse = await response.json();
  return data.access_token;
}

export async function register(userData: RegisterData): Promise<void> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
    }),
  });

  if (!response.ok) {
    throw new Error('No se pudo registrar el usuario');
  }
}

export async function getRole(token: string): Promise<string> {
  const response = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener el rol del usuario');
  }

  const data: UserRole = await response.json();
  return data.role;
}
