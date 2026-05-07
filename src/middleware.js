import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // 1. Define Route Categories
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthPageRoute = pathname.startsWith('/auth');
  const isProfileRoute = pathname.startsWith('/profile');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isHomeRoute = pathname === '/';

  // 2. Handle Unauthenticated Users
  if (!token) {
    if (isAdminRoute || isProfileRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // 3. Handle Authenticated Users
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role;

    // Condition: Unauthenticated hitting Login or Home -> redirect based on role
    if (isAuthPageRoute || isHomeRoute) {
      if (role === 'admin' || role === 'coach') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Condition: Athlete attempts to access Admin routes -> redirect to Dashboard
    if (isAdminRoute && role === 'athlete') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Condition: Admin/Coach attempts to access Athlete Dashboard -> redirect to Admin Dashboard
    if (isDashboardRoute && (role === 'admin' || role === 'coach')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token - treat as unauthenticated
    if (isAdminRoute || isProfileRoute || isDashboardRoute) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
