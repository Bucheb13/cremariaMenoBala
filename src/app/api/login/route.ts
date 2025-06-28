import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { user, pass } = await req.json()

  if (
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS
  ) {
    const response = NextResponse.json({ success: true })

    response.cookies.set('auth', 'true', {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/',
    })

    return response
  }

  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
}
