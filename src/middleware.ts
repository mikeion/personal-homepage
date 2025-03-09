import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define paths that require authentication
  const isAdminPath = path.startsWith('/admin') && 
                      !path.startsWith('/admin/login');
  
  // If it's not an admin path, allow the request
  if (!isAdminPath) {
    return NextResponse.next();
  }
  
  // Get the session token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // If no token or not an admin, redirect to login
  if (!token || token.role !== 'ADMIN') {
    const url = new URL('/admin/login', request.url);
    // Add original URL as a query parameter to redirect after login
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: ['/admin/:path*'],
}; 