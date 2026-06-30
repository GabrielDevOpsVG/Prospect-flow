import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Atualiza a sessão e checa se o usuário está logado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = new URL(request.url)
  const isAuthPage = url.pathname.startsWith('/login')
  
  // Lista de rotas protegidas
  const isProtectedRoute = 
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/campaigns') ||
    url.pathname.startsWith('/leads') ||
    url.pathname.startsWith('/templates') ||
    url.pathname.startsWith('/settings')

  if (isProtectedRoute && !user) {
    // Redireciona para o login se não estiver logado tentando acessar página protegida
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && user) {
    // Redireciona para o dashboard se estiver logado tentando acessar o login
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
