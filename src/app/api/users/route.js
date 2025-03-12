// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getSession();

  // Only allow admins
  if (session?.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(req) {
  const session = await getSession();
  const data = await req.json();

  if (session?.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...data,
        role: 'user',
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }
}

export async function PATCH(req) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const data = await req.json();

  if (session?.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 400 }
    );
  }
}

export async function DELETE(req) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (session?.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 400 }
    );
  }
}