import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

// ✅ Function to Verify Token
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

  // ✅ Extract token ONLY from httpOnly cookie
  const token = request.cookies.get('authToken')?.value;

  // 🔹 Redirect authenticated users away from login/register
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // 🔹 Redirect `/` to `/dashboard`
  if (isHome) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // 🔹 Protect private routes (redirect unauthenticated users)
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 🔹 Admin Route Protection (e.g., `/settings`)
  if (path.startsWith('/settings')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.nextUrl));

    const payload = await verifyToken(token);
    
    if (!payload || !payload.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    // ✅ Add custom header for admin routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-is-admin', 'true');

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  return NextResponse.next();
}

// ✅ Define which routes should use this middleware
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
