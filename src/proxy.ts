import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isProtectedPath =
    url.pathname.startsWith('/dashboard') ||
    (url.pathname === '/log' || url.pathname.startsWith('/log/')) ||
    url.pathname.startsWith('/calculator') ||
    url.pathname.startsWith('/insights') ||
    url.pathname.startsWith('/profile')

  const isAuthPath = url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')

  if (!user && isProtectedPath) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && (isAuthPath || url.pathname === '/')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (!user && url.pathname === '/') {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
