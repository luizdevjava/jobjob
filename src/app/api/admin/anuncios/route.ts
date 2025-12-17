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
    const anuncios = await db.anuncio.findMany({
      include: {
        cidade: {
          select: {
            nome: true,
            estado: true
          }
        },
        fotos: {
          where: {
            principal: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    // Se não tiver foto principal, busca a primeira foto
    for (const anuncio of anuncios) {
      if (anuncio.fotos.length === 0) {
        const primeiraFoto = await db.foto.findFirst({
          where: {
            anuncioId: anuncio.id
          },
          orderBy: {
            createdAt: 'asc'
          }
        })
        
        if (primeiraFoto) {
          anuncio.fotos.push(primeiraFoto)
        }
      }
    }

    return NextResponse.json(anuncios)
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar anúncios' },
      { status: 500 }
    )
  }
}