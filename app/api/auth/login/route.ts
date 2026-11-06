// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { createSession } from '@/lib/auth';
import { findDemoUser } from '@/lib/demo-data';


export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      return NextResponse.json({ error: 'Email tidak ditemukan' }, { status: 401 });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Buat session (Bisa login banyak orang sekaligus)
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch {
    console.warn('Database tidak tersedia. Login demo sementara diaktifkan.');

    const demoUser = findDemoUser(email, password);
    if (!demoUser) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    await createSession({
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
      demoMode: true,
    });

    return NextResponse.json({
      success: true,
      role: demoUser.role,
      demoMode: true,
    });
  }
}
