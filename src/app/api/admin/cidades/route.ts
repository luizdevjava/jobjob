import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-aqui'

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const cidades = await db.cidade.findMany({
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(cidades)
  } catch (error) {
    console.error('Erro ao buscar cidades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cidades' },
      { status: 500 }
    )
  }
}