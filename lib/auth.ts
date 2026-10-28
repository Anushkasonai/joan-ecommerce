import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getUserById, User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'bharatkart_super_secret_jwt_key_2026';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    
    const payload = verifyToken(token);
    if (!payload) return null;
    
    const user = getUserById(payload.userId);
    return user || null;
  } catch (error) {
    return null;
  }
}

export async function setSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
