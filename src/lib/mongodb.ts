import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

if (!uri) {
  throw new Error('❌ Por favor defina a variável MONGODB_URI no .env.local')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // Permite que essa variável seja reutilizada no modo development sem erro TS
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // Evita recriar conexão a cada atualização do Next.js
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise!
} else {
  // Em produção, cria nova conexão normalmente
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
