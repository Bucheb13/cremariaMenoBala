'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [erro, setErro] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setErro(data.error || 'Usuário ou senha inválidos')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login Admin</h1>

        <div>
          <label className="block text-sm font-medium mb-1">Usuário</label>
          <input
            className="w-full border border-gray-300 rounded p-2"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-stone-800 text-white py-2 rounded hover:bg-stone-700 transition"
        >
          Entrar
        </button>

        {erro && <p className="text-red-600 text-sm text-center mt-2">{erro}</p>}
      </form>
    </main>
  )
}
