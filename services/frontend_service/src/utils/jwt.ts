import type { JWTPayload } from '@/types/auth';

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export function getUserEmailFromToken(token: string): string {
  const payload = decodeJWT(token);
  return payload?.email?.split('@')[0] || 'Usuario';
}
