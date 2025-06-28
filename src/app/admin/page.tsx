'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  const [titulo, setTitulo] = useState('')
  const [legenda, setLegenda] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [mensagem, setMensagem] = useState('')

  // Verifica se o admin está logado
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/check-auth')
      if (!res.ok) router.push('/login')
    }
    checkAuth()
  }, [router])

  // Cria previews sempre que files mudar
  useEffect(() => {
    if (files.length === 0) {
      setPreviews([])
      return
    }

    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviews(urls)

    // Cleanup dos URLs antigos
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  // Logout
  const handleLogout = async () => {
    await fetch('/api/logout')
    router.push('/login')
  }

  // Envio do formulário com múltiplos arquivos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem('')

    if (files.length === 0) {
      setMensagem('❌ Selecione pelo menos uma imagem ou vídeo.')
      return
    }

    const formData = new FormData()
    formData.append('titulo', titulo)
    formData.append('legenda', legenda)
    files.forEach((file) => formData.append('files', file)) // 'files' no plural

    try {
      const res = await fetch('/api/itens', {
        method: 'POST',
        body: formData, // Não precisa setar headers aqui
      })

      if (res.ok) {
        setMensagem('✅ Item salvo com sucesso!')
        setTitulo('')
        setLegenda('')
        setFiles([])
        setPreviews([])
      } else {
        const erro = await res.json()
        setMensagem(`❌ Erro: ${erro.error || 'Falha ao salvar'}`)
      }
    } catch (error) {
      setMensagem('❌ Erro de conexão ou servidor.')
    }
  }

  // Atualiza arquivos selecionados
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(Array.from(e.target.files))
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200 relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-sm text-red-600 hover:underline"
        >
          Sair
        </button>

        <h1 className="text-3xl font-bold mb-6 text-stone-800">Painel Administrativo</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Título</label>
            <input
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Legenda</label>
            <input
              className="w-full border border-gray-300 rounded p-2"
              value={legenda}
              onChange={(e) => setLegenda(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Selecione uma ou mais Imagens ou Vídeos
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="w-full"
              // REMOVA required daqui para não conflitar com validação JS
            />
          </div>

          {/* Preview dos arquivos selecionados */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {previews.map((preview, i) => {
              const file = files[i]
              if (!file) return null

              if (file.type.startsWith('image/')) {
                return (
                  <img
                    key={preview} // use preview url como key
                    src={preview}
                    alt={`preview-${i}`}
                    className="w-full h-auto rounded shadow"
                  />
                )
              }

              if (file.type.startsWith('video/')) {
                return (
                  <video
                    key={preview}
                    controls
                    className="w-full h-auto rounded shadow"
                    src={preview}
                  />
                )
              }

              return null
            })}
          </div>

          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-2 rounded hover:bg-stone-700 transition"
          >
            Salvar
          </button>
        </form>

        {mensagem && <p className="mt-4 text-center font-medium">{mensagem}</p>}
      </div>
    </main>
  )
}
