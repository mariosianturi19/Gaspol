// lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { SESSION_SECRET } from './session-secret';

export async function createSession(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d') // Login berlaku 1 hari
    .sign(SESSION_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, SESSION_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}