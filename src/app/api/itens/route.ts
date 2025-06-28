import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import clientPromise from '@/lib/mongodb'

export const config = {
  api: {
    bodyParser: false, // evita erro com multipart/form-data
  },
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const titulo = formData.get('titulo') as string
    const legenda = (formData.get('legenda') as string) || ''
    const files = formData.getAll('files') as File[]

    if (!titulo || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'Título e pelo menos uma imagem/vídeo são obrigatórios.' },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const imagens: string[] = []

    for (const file of files) {
      if (typeof file === 'string') continue

      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = path.join(uploadDir, filename)

      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      imagens.push(`/uploads/${filename}`)
    }

    // Salva no MongoDB
    const client = await clientPromise
    const db = client.db('vitrine')
    const collection = db.collection('itens')

    const novoItem = {
      titulo,
      legenda,
      imagens,
      criadoEm: new Date(),
    }

    await collection.insertOne(novoItem)

    return NextResponse.json(
      { message: '✅ Item criado com sucesso' },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erro ao criar item:', error)
    return NextResponse.json(
      { error: 'Erro interno ao criar item' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('vitrine')
    const collection = db.collection('itens')

    const itens = await collection.find().sort({ criadoEm: -1 }).toArray()

    return NextResponse.json(itens, { status: 200 })
  } catch (error) {
    console.error('❌ Erro ao buscar itens:', error)
    return NextResponse.json({ error: 'Erro ao buscar itens' }, { status: 500 })
  }
}
