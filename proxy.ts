import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';
import { parseSetCookie } from 'cookie';

import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/profile/edit', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = false;
  let response = NextResponse.next();

  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    try {
      // Calling our local Next.js proxy which will attempt to refresh the session
      // checkSession() now returns the Axios response
      const sessionRes = await checkSession();
      if (sessionRes && sessionRes.status === 200) {
        isAuthenticated = true;
        const setCookieHeader = sessionRes.headers['set-cookie'];
        if (setCookieHeader) {
          const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);
            if (parsed && parsed.name && parsed.value) {
              response.cookies.set(parsed.name, parsed.value, parsed as any);
            }
          }
        }
      }
    } catch (error) {
      // Session refresh failed
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
