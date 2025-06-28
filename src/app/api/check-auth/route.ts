import { NextResponse } from 'next/server'

export async function GET() {
  const auth = NextResponse.next().cookies.get('auth')?.value
  if (auth === 'true') {
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false }, { status: 401 })
}
