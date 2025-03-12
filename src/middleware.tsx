import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = ['/login', '/register'].includes(path);
  const isHome = path === '/';

  const token = request.cookies.get('token')?.value || 
               request.headers.get('authorization')?.split(" ")[1];

  // Redirect authenticated users from public pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // Redirect home to dashboard
  if (isHome) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // Protect private routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Admin route protection
  if (path.startsWith('/settings')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.nextUrl));

    try {
      const payload = await verifyToken(token);

      // Check for admin status in payload
      if (!payload || !payload.isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
      }

      // Add admin flag to request headers for downstream components
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-is-admin', 'true');

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      });
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
