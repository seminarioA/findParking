// API para autenticación
export async function login(email: string, password: string): Promise<string> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  return data.access_token;
}

// Obtener el rol del usuario usando el token JWT
export async function getRole(token: string): Promise<string> {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('No se pudo obtener el rol');
  const data = await res.json();
  return data.role;
}
