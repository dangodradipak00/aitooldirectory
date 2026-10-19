import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';

const protectAdmin = auth.middleware({ loginUrl: '/login/admin/' });

export default function proxy(request: NextRequest) {
  return protectAdmin(request);
}

export const config = { matcher: ['/admin/:path*'] };
